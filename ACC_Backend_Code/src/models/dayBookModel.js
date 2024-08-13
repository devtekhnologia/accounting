const { query } = require('../config/database');

const getFirmsByUserId = async (user_id) => {
  const sql = 'SELECT firm_id FROM tbl_user_firm WHERE user_id = ?';
  return await query(sql, [user_id]);
};

const getAllTransactionsByFirmId = async (firm_id, startDate, endDate) => {
  let sql = `
    SELECT 
      t.transaction_id, t.amount, t.transaction_date, t.from_gl_id, t.to_gl_id, t.remark,
      from_gl.gl_name AS from_gl_name, 
      to_gl.gl_name AS to_gl_name,
      from_firm.firm_name AS from_firm_name,
      to_firm.firm_name AS to_firm_name
    FROM tbl_transactions t
    JOIN tbl_general_ledgers from_gl ON t.from_gl_id = from_gl.gl_id
    JOIN tbl_general_ledgers to_gl ON t.to_gl_id = to_gl.gl_id
    LEFT JOIN tbl_firms from_firm ON t.from_firm_id = from_firm.firm_id
    LEFT JOIN tbl_firms to_firm ON t.to_firm_id = to_firm.firm_id
    WHERE t.from_firm_id = ? OR t.to_firm_id = ?
  `;

  const params = [firm_id, firm_id];

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

module.exports = { getFirmsByUserId, getAllTransactionsByFirmId };
