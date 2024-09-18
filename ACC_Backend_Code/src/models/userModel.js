const { query } = require('../config/database');
const bcrypt = require('bcrypt');
var crypto = require('crypto');


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

    const hashedPassword = encrypt(password);

    console.log(hashedPassword);
    console.log(decrypt(hashedPassword));

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

    // Decrypt the stored encrypted password
    const decryptedPassword = decrypt(user.usr_password);

    // // Use timingSafeEqual for secure comparison
    // const passwordBuffer = Buffer.from(password, 'utf8');
    // const decryptedPasswordBuffer = Buffer.from(decryptedPassword, 'utf8');

    // const passwordMatch = crypto.timingSafeEqual(passwordBuffer, decryptedPasswordBuffer);

    const passwordMatch = password === decryptedPassword;

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

    const hashedPassword = encrypt(password);
    const insertUserQuery = 'INSERT INTO tbl_users (usr_name, usr_email, usr_password, usr_contact, usr_address, usr_status, usr_role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const result = await query(insertUserQuery, [name, email, hashedPassword, contact, address, status, role]);
    return result.insertId;
  } catch (err) {
    throw new Error(err.message);
  }
};


//-----------Password encryption and  Decryption---------//

const algorithm = 'aes-256-cbc';  // AES encryption algorithm
const key = crypto.scryptSync('mySecretKey', 'salt', 32);  // Generate key with scrypt

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(16);  // Generate a unique IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);  // Initialize cipher with key and IV
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return the IV and encrypted text combined in 'iv:encryptedText' format
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt function
function decrypt(encryptedText) {
  // Validate input
  if (!encryptedText || typeof encryptedText !== 'string') {
    throw new Error('Invalid input for decryption. Expected a string.');
  }

  // Split the encrypted text into IV and encrypted data
  const [ivHex, encrypted] = encryptedText.split(':');

  // Ensure both IV and encrypted text are present
  if (!ivHex || !encrypted) {
    throw new Error('Invalid encrypted text format. Expected format is iv:encryptedData.');
  }

  // Convert the IV from hex
  const iv = Buffer.from(ivHex, 'hex');

  // Initialize decipher with key and IV
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

//--------------------------------------------------------//

const userDetails = async (user_id) => {
  try {
    const sql = 'SELECT * FROM tbl_users WHERE user_id = ?';
    const [user] = await query(sql, [user_id]);
    console.log(user);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the password is defined and not empty
    if (user.usr_password && typeof user.usr_password === 'string') {
      user.usr_password = decrypt(user.usr_password);
    } else {
      console.warn('No password found for the user or password is not a valid string');
    }

    return user;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error('Failed to retrieve user details');
  }
};


const updateUserDetails = async (user_id, name, email, password, contact, address, status, role) => {
  const hashedPassword = encrypt(password);
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

const assignFirmToUser = async (user_id, firm_ids, added_by_user_id) => {
  try {
    const userRoleQuery = 'SELECT usr_role FROM tbl_users WHERE user_id = ?';
    const [user] = await query(userRoleQuery, [user_id]);
    const userRole = user.usr_role;

    const checkExistenceQuery = 'SELECT COUNT(*) as count FROM tbl_user_firm WHERE user_id = ? AND firm_id = ?';
    const assignFirmQuery = 'INSERT INTO tbl_user_firm (user_id, firm_id, uf_usr_role, added_by_user_id) VALUES (?, ?, ?, ?)';

    for (const firm_id of firm_ids) {
      const [result] = await query(checkExistenceQuery, [user_id, firm_id]);
      if (result.count === 0) {
        await query(assignFirmQuery, [user_id, firm_id, userRole, added_by_user_id]);
      } else {
        console.log(`User ${user_id} is already assigned to firm ${firm_id}, skipping...`);
      }
    }
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

const updateFirmUser = async (user_id, selectedFirmIds = [], deselectedFirmIds = [], added_by_user_id) => {
  const insertSql = 'INSERT INTO tbl_user_firm (user_id, firm_id, uf_usr_role, added_by_user_id) VALUES (?, ?, ?, ?)';
  const deleteSql = 'DELETE FROM tbl_user_firm WHERE user_id = ? AND firm_id = ?';
  const checkSql = 'SELECT COUNT(*) as count FROM tbl_user_firm WHERE user_id = ? AND firm_id = ?';

  const queries = [];

  const uf_usr_role = 'firm_user';

  // Insert newly selected firm_ids
  for (const firm_id of selectedFirmIds) {
    // Check if the pair of user_id and firm_id already exists

    const result = await query(checkSql, [user_id, firm_id]);
    if (result[0].count === 0) {
      queries.push(query(insertSql, [user_id, firm_id, uf_usr_role, added_by_user_id]));
    }
  }

  // Delete deselected firm_ids
  for (const firm_id of deselectedFirmIds) {
    queries.push(query(deleteSql, [user_id, firm_id]));
  }

  await Promise.all(queries);
};



const getUserFirms = async (user_id) => {
  try {
    const sql = `
      SELECT uf.firm_id, f.firm_name
      FROM tbl_user_firm uf
      JOIN tbl_firms f ON uf.firm_id = f.firm_id
      WHERE uf.user_id = ?`;

    // Execute the query
    const rows = await query(sql, [user_id]);

    // Log the results for debugging
    console.log('Query results:', rows);

    return rows;
  } catch (error) {
    console.error('Error in getUserFirms:', error);
    throw error;
  }
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
  getUserFirms,
  firmUser,
  updateFirmUser,
  deleteFirmUser,
  usersAddedByUser,
};
