const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'Tekhnologia',
  password: 'Tekhnologia@123',
  database: 'accounting',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

initializeDatabase();

const query = async (sql, values) => {
  try {
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

const beginTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

const commit = async (connection) => {
  try {
    await connection.commit();
  } finally {
    connection.release();
  }
};

const rollback = async (connection) => {
  try {
    await connection.rollback();
  } finally {
    connection.release();
  }
};

module.exports = { query, beginTransaction, commit, rollback };
