// receiptModel.js

const { query } = require('../config/database');

const userHasAccessToFirm = async (user_id, firm_id) => {
  const sql = 'SELECT * FROM tbl_user_firm WHERE user_id = ? AND firm_id = ?';
  const results = await query(sql, [user_id, firm_id]);
  return results.length > 0;
};

const createReceiptTransaction = async (to_firm_id, to_gl_id, from_firm_id, from_gl_id, user_id, amount, remark, trans_type, transaction_date) => {
  try {
    const userHasAccess = await userHasAccessToFirm(user_id, to_firm_id);
    if (!userHasAccess) {
      throw new Error('User does not have access to the firm');
    }

    const insertTransactionQuery = `
      INSERT INTO tbl_transactions (to_firm_id, to_gl_id, from_firm_id, from_gl_id, user_id, amount, remark, trans_type, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(insertTransactionQuery, [to_firm_id, to_gl_id, from_firm_id, from_gl_id, user_id, amount, remark, trans_type, transaction_date]);

    const updateGLQuery = `
      UPDATE tbl_general_ledgers
      SET balance = balance + ?
      WHERE gl_id = ? AND firm_id = ?
    `;
    await query(updateGLQuery, [amount, to_gl_id, to_firm_id]);
    await query(updateGLQuery, [-amount, from_gl_id, from_firm_id]);

    return result.insertId;
  } catch (err) {
    throw new Error('Error creating receipt transaction');
  }
};

const getReceiptsByFirmId = async (to_firm_id, startDate, endDate) => {
  try {
    let sql = `
      SELECT 
        t.transaction_id, t.amount, t.transaction_date, t.from_gl_id, t.to_gl_id, t.remark, t.trans_type,
        from_gl.gl_name AS from_gl_name, 
        to_gl.gl_name AS to_gl_name,
        from_firm.firm_name AS from_firm_name,
        to_firm.firm_name AS to_firm_name
      FROM tbl_transactions t
      JOIN tbl_general_ledgers from_gl ON t.from_gl_id = from_gl.gl_id
      JOIN tbl_general_ledgers to_gl ON t.to_gl_id = to_gl.gl_id
      JOIN tbl_firms from_firm ON t.from_firm_id = from_firm.firm_id
      JOIN tbl_firms to_firm ON t.to_firm_id = to_firm.firm_id
      WHERE t.to_firm_id = ?
    `;
    const params = [to_firm_id];

    if (startDate) {
      sql += ' AND t.transaction_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND t.transaction_date <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY t.transaction_date DESC';
    const transactions = await query(sql, params);
    return transactions;
  } catch (err) {
    throw new Error('Error fetching receipt transactions');
  }
};

module.exports = { createReceiptTransaction, getReceiptsByFirmId, userHasAccessToFirm };
