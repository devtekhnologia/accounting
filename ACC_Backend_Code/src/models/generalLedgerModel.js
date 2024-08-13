const { query } = require('../config/database');

// const createGeneralLedger = async (firm_id, gl_name) => {
//   const sql = 'INSERT INTO tbl_general_ledgers (firm_id, gl_name) VALUES (?, ?)';
//   const result = await query(sql, [firm_id, gl_name]);
//   return result.insertId;
// };

// const getGeneralLedgersByFirm = async (firm_id) => {
//   const sql = `
//     SELECT gl.gl_id, gl.gl_name, gl.gl_status, f.firm_name 
//     FROM tbl_general_ledgers gl
//     JOIN tbl_firms f ON gl.firm_id = f.firm_id
//     WHERE gl.firm_id = ?
//   `;
//   return await query(sql, [firm_id]);
// };

const createGeneralLedger = async (firm_id, gl_name) => {
  const sql = 'INSERT INTO tbl_general_ledgers (firm_id, gl_name) VALUES (?, ?)';
  const result = await query(sql, [firm_id, gl_name]);
  return result.insertId;
};

const getGeneralLedgersByFirm = async (firm_id) => {
  const sql = `
    SELECT gl.gl_id, gl.gl_name, gl.gl_status, gl.balance, f.firm_name
    FROM tbl_general_ledgers gl
    JOIN tbl_firms f ON gl.firm_id = f.firm_id
    WHERE gl.firm_id = ?
  `;
  return await query(sql, [firm_id]);
};

const updateGeneralLedger = async (firm_id, gl_id, gl_name, gl_status) => {
  const sql = `
    UPDATE tbl_general_ledgers 
    SET gl_name = ?, gl_status = ?
    WHERE firm_id = ? AND gl_id = ?
  `;
  const result = await query(sql, [gl_name, gl_status, firm_id, gl_id]);
  return result.affectedRows > 0;
};

const deleteGeneralLedger = async (firm_id, gl_id) => {
  const sql = 'DELETE FROM tbl_general_ledgers WHERE firm_id = ? AND gl_id = ?';
  const result = await query(sql, [firm_id, gl_id]);
  return result.affectedRows > 0;
};

const generalLedgerExists = async (firm_id, gl_name) => {
  const sql = 'SELECT * FROM tbl_general_ledgers WHERE firm_id = ? and gl_name = ?';
  const [generalLedger] = await query(sql, [firm_id, gl_name]);
  return generalLedger;
};

module.exports = { createGeneralLedger, getGeneralLedgersByFirm, updateGeneralLedger, deleteGeneralLedger, generalLedgerExists };
