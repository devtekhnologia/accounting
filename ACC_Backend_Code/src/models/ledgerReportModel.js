const { query, beginTransaction, commit, rollback } = require('../config/database');

const getAllTransactionsByFirmIdAndGlId = async (from_firm_id, gl_id, startDate, endDate) => {
  let sql = `
      SELECT 
        t.transaction_id, t.amount, t.transaction_date, t.from_firm_id, t.from_gl_id, t.to_gl_id, t.remark, t.trans_type,
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
        AND (t.from_gl_id = ? OR t.to_gl_id = ?)
    `;

  const params = [from_firm_id, gl_id, gl_id]; // Including gl_id in the query

  if (startDate) {
    sql += ' AND t.transaction_date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND t.transaction_date <= ?';
    params.push(endDate);
  }

  sql += ' ORDER BY t.transaction_date DESC';

  return await query(sql, params);
};


const getReceiptsByFirmIdAndGlId = async (to_firm_id, gl_id, startDate, endDate) => {
  try {
    let sql = `
        SELECT 
          t.transaction_id, t.amount, t.transaction_date, t.from_gl_id, t.to_firm_id, t.to_gl_id, t.remark, t.trans_type,
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
          AND (t.from_gl_id = ? OR t.to_gl_id = ?)
      `;

    const params = [to_firm_id, gl_id, gl_id]; // Including gl_id in the query

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


module.exports = { getAllTransactionsByFirmIdAndGlId, getReceiptsByFirmIdAndGlId };
