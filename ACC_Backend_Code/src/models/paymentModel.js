const { query, beginTransaction, commit, rollback } = require('../config/database');

const userHasGeneralLedger = async (firm_id, gl_id) => {
  try {
    const sql = 'SELECT * FROM tbl_general_ledgers WHERE firm_id = ? AND gl_id = ?';
    const results = await query(sql, [firm_id, gl_id]);
    return results && results.length > 0;
  } catch (error) {
    console.error('Error checking general ledger association:', error);
    throw error;
  }
};

const userHasAccessToFirm = async (user_id, firm_id) => {
  const sql = 'SELECT * FROM tbl_user_firm WHERE user_id = ? AND firm_id = ?';
  const results = await query(sql, [user_id, firm_id]);
  return results.length > 0;
};

const createPayment = async (from_gl_id, to_gl_id, from_firm_id, to_firm_id, user_id, amount, remark, trans_type, transaction_date) => {
  const connection = await beginTransaction();
  try {
    // Check if General Ledgers are associated with the firms and user has access
    const fromGLExists = await userHasGeneralLedger(from_firm_id, from_gl_id);
    const toGLExists = await userHasGeneralLedger(to_firm_id, to_gl_id);
    const userHasAccess = await userHasAccessToFirm(user_id, from_firm_id);

    if (!fromGLExists || !toGLExists || !userHasAccess) {
      throw new Error('General Ledger not associated with the given firm or user does not have access');
    }

    // Update balances in the general ledgers
    const debitQuery = 'UPDATE tbl_general_ledgers SET balance = balance - ? WHERE gl_id = ?';
    await query(debitQuery, [amount, from_gl_id], connection);

    const creditQuery = 'UPDATE tbl_general_ledgers SET balance = balance + ? WHERE gl_id = ?';
    await query(creditQuery, [amount, to_gl_id], connection);

    // Insert the transaction with the transaction_date
    const insertTransactionQuery = `
      INSERT INTO tbl_transactions 
      (from_gl_id, to_gl_id, amount, from_firm_id, to_firm_id, user_id, remark, trans_type, transaction_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(insertTransactionQuery, [from_gl_id, to_gl_id, amount, from_firm_id, to_firm_id, user_id, remark, trans_type, transaction_date], connection);

    // Commit the transaction
    await commit(connection);
    return result.insertId;
  } catch (error) {
    // Rollback the transaction in case of error
    await rollback(connection);
    throw error;
  }
};



const getAllTransactionsByFirmId = async (from_firm_id, startDate, endDate) => {
  let sql = `
    SELECT 
      t.transaction_id, t.amount, t.transaction_date, t.from_gl_id, t.to_gl_id, t.remark, t.trans_type,
      from_gl.gl_name AS from_gl_name, 
      to_gl.gl_name AS to_gl_name,
      to_firm.firm_name AS to_firm_name,
      from_firm.firm_name AS from_firm_name
    FROM tbl_transactions t
    JOIN tbl_general_ledgers from_gl ON t.from_gl_id = from_gl.gl_id
    JOIN tbl_general_ledgers to_gl ON t.to_gl_id = to_gl.gl_id
    JOIN tbl_firms from_firm ON t.from_firm_id = from_firm.firm_id
    JOIN tbl_firms to_firm ON t.to_firm_id = to_firm.firm_id
    WHERE t.from_firm_id = ?
  `;

  const params = [from_firm_id];

  if (startDate) {
    sql += ' AND t.transaction_date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND t.transaction_date <= ?';
    params.push(endDate);
  }

  sql += ' ORDER BY t.transaction_date DESC';
  // console.log('Executing SQL:', sql);
  // console.log('With parameters:', params);

  return await query(sql, params);
};


const getPaymentById = async (transaction_id) => {
  const sql = `
    SELECT t.transaction_id, t.amount, t.transaction_date, t.from_gl_id, t.to_gl_id, t.trans_type,
           from_gl.firm_id AS from_firm_id, from_gl.gl_name AS from_gl_name,
           to_gl.firm_id AS to_firm_id, to_gl.gl_name AS to_gl_name,
           t.user_id
    FROM tbl_transactions t
    JOIN tbl_general_ledgers from_gl ON t.from_gl_id = from_gl.gl_id
    JOIN tbl_general_ledgers to_gl ON t.to_gl_id = to_gl.gl_id
    WHERE t.transaction_id = ?
  `;
  const [transaction] = await query(sql, [transaction_id]);
  return transaction;
};

const getTotalBalanceByFirmId = async (firm_id) => {
  const sql = 'SELECT SUM(gl.balance) AS total_balance FROM tbl_general_ledgers gl WHERE gl.firm_id = ?';
  const [result] = await query(sql, [firm_id]);
  return result.total_balance || 0;
};

module.exports = { createPayment, getAllTransactionsByFirmId, getPaymentById, userHasGeneralLedger, getTotalBalanceByFirmId };
