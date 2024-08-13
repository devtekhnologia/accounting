const { query } = require('../config/database');
const bcrypt = require('bcrypt');

const userExists = async (contact, email) => {
  try {
    const checkUserQuery = 'SELECT * FROM tbl_users WHERE usr_contact = ? OR usr_email = ?';
    const [existingUser] = await query(checkUserQuery, [contact, email]);
    return existingUser;
  } catch (err) {
    console.error('Error checking if user exists:', err);
    throw new Error('Error checking if user exists');
  }
};

const userHasFirm = async (firm_id) => {
  try {
    const checkFirmAssignmentQuery = 'SELECT * FROM tbl_user_firm WHERE firm_id = ?';
    const [firmUser] = await query(checkFirmAssignmentQuery, [firm_id]);
    return firmUser;
  } catch (err) {
    console.error('Error checking if firm is assigned to a user:', err);
    throw new Error('Error checking if firm is assigned to a user');
  }
};

const registerUser = async (name, email, password, contact, address, status, role, firm_id, added_by_user_id) => {
  try {
    if (await userExists(contact, email)) {
      throw new Error("User already exists");
    }

    if (role === 'firm_user' && !firm_id) {
      throw new Error("Firm ID is required for firm_user role");
    }

    if (role === 'firm_user' && await userHasFirm(firm_id)) {
      throw new Error("This firm is already assigned to another user");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = 'INSERT INTO tbl_users (usr_name, usr_email, usr_password, usr_contact, usr_address, usr_status, usr_role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const result = await query(insertUserQuery, [name, email, hashedPassword, contact, address, status, role]);
    const insertedId = result.insertId;

    if (role === 'firm_user') {
      const assignFirmQuery = 'INSERT INTO tbl_user_firm (user_id, firm_id, uf_usr_role, added_by_user_id) VALUES (?, ?, ?, ?)';
      await query(assignFirmQuery, [insertedId, firm_id, 'firm_user', added_by_user_id]);
    }

    return insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const authenticateUser = async (email, password) => {
  try {
    const checkUserQuery = 'SELECT * FROM tbl_users WHERE usr_email = ?';
    const [user] = await query(checkUserQuery, [email]);

    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.usr_password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (err) {
    console.error('Error authenticating user:', err);
    throw new Error('Invalid credentials');
  }
};

const addUser = async (name, email, password, contact, address, status, role) => {
  try {
    if (await userExists(contact, email)) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = 'INSERT INTO tbl_users (usr_name, usr_email, usr_password, usr_contact, usr_address, usr_status, usr_role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const result = await query(insertUserQuery, [name, email, hashedPassword, contact, address, status, role]);
    return result.insertId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const userDetails = async (user_id) => {
  const sql = 'SELECT * FROM tbl_users WHERE user_id = ?';
  const [user] = await query(sql, [user_id]);
  return user;
};

const updateUserDetails = async (user_id, name, email, password, contact, address, status, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'UPDATE tbl_users SET usr_name = ?, usr_email = ?, usr_password = ?, usr_contact = ?, usr_address = ?, usr_status = ?, usr_role = ? WHERE user_id = ?';
  await query(sql, [name, email, hashedPassword, contact, address, status, role, user_id]);
};

const deleteUser = async (user_id) => {
  const sqlDeleteUserFirm = `
    DELETE FROM tbl_user_firm
    WHERE user_id = ?`;

  const sqlDeleteUser = `
    DELETE FROM tbl_users
    WHERE user_id = ?`;
  await query(sqlDeleteUserFirm, [user_id]);
  await query(sqlDeleteUser, [user_id]);
};

const assignFirmToUser = async (user_id, firm_id, added_by_user_id) => {
  try {
    const userRoleQuery = 'SELECT usr_role FROM tbl_users WHERE user_id = ?';
    const [user] = await query(userRoleQuery, [user_id]);
    const userRole = user.usr_role;

    const assignFirmQuery = 'INSERT INTO tbl_user_firm (user_id, firm_id, uf_usr_role, added_by_user_id) VALUES (?, ?, ?, ?)';
    await query(assignFirmQuery, [user_id, firm_id, userRole, added_by_user_id]);
  } catch (err) {
    console.error('Error assigning firm to user:', err);
    throw new Error('Error assigning firm to user');
  }
};

// const updateFirmUser = async (uf_id, user_id, firm_ids, added_by_user_id) => {
//   const deleteOldFirmsQuery = 'DELETE FROM tbl_user_firm WHERE user_id = ?';
//   await query(deleteOldFirmsQuery, [user_id]);

//   const userRoleQuery = 'SELECT usr_role FROM tbl_users WHERE user_id = ?';
//   const [user] = await query(userRoleQuery, [user_id]);
//   const userRole = user.usr_role;

//   const assignFirmQuery = 'INSERT INTO tbl_user_firm (user_id, firm_id, uf_usr_role, added_by_user_id) VALUES (?, ?, ?, ?)';

//   for (const firm_id of firm_ids) {
//     await query(assignFirmQuery, [user_id, firm_id, userRole, added_by_user_id]);
//   }
// };

const updateFirmUser = async (uf_id, user_id, firm_id) => {
  const sql = 'UPDATE tbl_user_firm SET user_id = ?, firm_id = ? WHERE uf_id = ?';
  await query(sql, [user_id, firm_id, uf_id]);
};

const firmUser = async (uf_id) => {
  const sql = `
    SELECT uf.uf_id, uf.uf_usr_role, uf.user_id, u.usr_name, uf.firm_id, f.firm_name 
    FROM tbl_user_firm uf
    JOIN tbl_users u ON uf.user_id = u.user_id
    JOIN tbl_firms f ON uf.firm_id = f.firm_id
    WHERE uf.uf_id = ?`;
  const [firmUserDetails] = await query(sql, [uf_id]);
  return firmUserDetails;
};


const deleteFirmUser = async (uf_id) => {
  const sql = 'DELETE FROM tbl_user_firm WHERE uf_id = ?';
  await query(sql, [uf_id]);
};

const usersAddedByUser = async (user_id) => {
  const sql = `
    SELECT uf.uf_id, u.user_id, u.usr_name, u.usr_email, u.usr_address, u.usr_status, uf.firm_id, f.firm_name 
    FROM tbl_users u
    JOIN tbl_user_firm uf ON u.user_id = uf.user_id
    JOIN tbl_firms f ON uf.firm_id = f.firm_id
    WHERE uf.added_by_user_id = ?`;
  const users = await query(sql, [user_id]);
  return users;
};

module.exports = {
  registerUser,
  authenticateUser,
  addUser,
  userDetails,
  updateUserDetails,
  deleteUser,
  assignFirmToUser,
  firmUser,
  updateFirmUser,
  deleteFirmUser,
  usersAddedByUser,
};
