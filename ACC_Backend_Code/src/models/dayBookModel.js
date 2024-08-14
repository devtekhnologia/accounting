const { query } = require('../config/database');

// Function to get firms by user ID
const getFirmIdsByUserId = async (user_id) => {
  const sql = `
    SELECT f.firm_id
    FROM tbl_firms f
    LEFT JOIN tbl_user_firm uf ON f.firm_id = uf.firm_id
    WHERE uf.user_id = ?`;
  return await query(sql, [user_id]);
};

module.exports = {
  getFirmIdsByUserId
};
