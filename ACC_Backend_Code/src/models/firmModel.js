const { query } = require('../config/database');

// Existing function to create a firm
const createFirm = async (firm_name, firm_email, firm_gstno, firm_address, firm_status) => {
  const sql = 'INSERT INTO tbl_firms (firm_name, firm_email, firm_gstno, firm_address, firm_status) VALUES (?, ?, ?, ?, ?)';
  const result = await query(sql, [firm_name, firm_email, firm_gstno, firm_address, firm_status]);
  return result.insertId;
};

// Existing function to link user to firm
const linkUserToFirm = async (user_id, firm_id, role) => {
  const sql = 'INSERT INTO tbl_user_firm (user_id, firm_id, uf_usr_role) VALUES (?, ?, ?)';
  await query(sql, [user_id, firm_id, role]);
};

// Existing function to get a firm by ID
const getFirmById = async (firm_id) => {
  const sql = `
    SELECT f.*, uf.user_id, uf.uf_usr_role
    FROM tbl_firms f
    LEFT JOIN tbl_user_firm uf ON f.firm_id = uf.firm_id
    WHERE f.firm_id = ?`;
  const [firm] = await query(sql, [firm_id]);
  return firm;
};

// Existing function to get all firms
const getAllFirms = async () => {
  const sql = `
    SELECT f.*, uf.user_id, uf.uf_usr_role
    FROM tbl_firms f
    LEFT JOIN tbl_user_firm uf ON f.firm_id = uf.firm_id`;
  return await query(sql);
};

// Existing function to check if a firm exists
const firmExists = async (firm_email, firm_gstno) => {
  const sql = 'SELECT * FROM tbl_firms WHERE firm_email = ? OR firm_gstno = ?';
  const [firm] = await query(sql, [firm_email, firm_gstno]);
  return firm;
};

// New function to check if a firm name exists
const firmNameExists = async (firm_name) => {
  const sql = 'SELECT * FROM tbl_firms WHERE firm_name = ?';
  const [firm] = await query(sql, [firm_name]);
  return firm;
};

// Function to get firms by user ID
const getFirmsByUserId = async (user_id) => {
  const sql = `
    SELECT f.*, uf.user_id, uf.uf_usr_role, uf.added_by_user_id
    FROM tbl_firms f
    LEFT JOIN tbl_user_firm uf ON f.firm_id = uf.firm_id
    WHERE uf.user_id = ?`;
  return await query(sql, [user_id]);
};

// Function to update a firm
const updateFirm = async (firm_id, firm_name, firm_email, firm_gstno, firm_address, firm_status) => {
  const sql = 'UPDATE tbl_firms SET firm_name = ?, firm_email = ?, firm_gstno = ?, firm_address = ?, firm_status = ? WHERE firm_id = ?';
  await query(sql, [firm_name, firm_email, firm_gstno, firm_address, firm_status, firm_id]);
};

// Function to delete a firm
const deleteFirm = async (firm_id) => {
  // Delete from tbl_user_firm first
  const deleteUserFirmSql = 'DELETE FROM tbl_user_firm WHERE firm_id = ?';
  await query(deleteUserFirmSql, [firm_id]);

  // Delete from tbl_firms
  const deleteFirmSql = 'DELETE FROM tbl_firms WHERE firm_id = ?';
  await query(deleteFirmSql, [firm_id]);
};

// Function to get total balance for a user
const getTotalBalanceByUserId = async (user_id) => {
  const sql = `
    SELECT SUM(gl.balance) as total_balance
    FROM tbl_general_ledgers gl
    INNER JOIN tbl_user_firm uf ON gl.firm_id = uf.firm_id
    WHERE uf.user_id = ?
  `;
  const [result] = await query(sql, [user_id]);
  return result.total_balance;
};


module.exports = { createFirm, getFirmById, getAllFirms, firmExists, linkUserToFirm, firmNameExists, getFirmsByUserId, updateFirm, deleteFirm, getTotalBalanceByUserId };
