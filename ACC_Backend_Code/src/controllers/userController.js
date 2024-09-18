const jwt = require('jsonwebtoken');
const {
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
} = require('../models/userModel');

// User registration
const registerYourself = async (req, res) => {
  try {
    const { name, email, password, contact, address, status, role, firm_id, added_by_user_id } = req.body;
    if (!name || !email || !contact || !password) {
      return res.status(400).send({ status: false, message: 'All fields are required' });
    }

    const userId = await registerUser(name, email, password, contact, address, status, role, firm_id, added_by_user_id);
    res.status(201).send({ status: true, data: userId, message: 'User registered successfully' });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).send({ status: false, message: 'User already exists' });
    } else if (error.message === 'Firm ID is required for firm_user role' || error.message === 'This firm is already assigned to another user') {
      return res.status(400).send({ status: false, message: error.message });
    }
    res.status(500).send({ status: false, message: error.message });
  }
};

// User login
const loginUserHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ status: false, message: 'Email and password are required' });
    }

    const user = await authenticateUser(email, password);

    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.usr_email,
        role: user.usr_role,
      },
      'Tekhnologia1985',
      { expiresIn: '1h' }
    );
    console.log(user.email);
    res.status(200).send({ status: true, data: { token }, message: 'Login successful' });
  } catch (error) {
    res.status(401).send({ status: false, message: error.message });
  }
};

// Add user
const addUserHandler = async (req, res) => {
  try {
    const { name, email, password, contact, address, status, role } = req.body;
    if (!name || !email || !password || !contact || !address || !status || !role) {
      return res.status(400).send({ status: false, message: 'All fields are required' });
    }

    const userId = await addUser(name, email, password, contact, address, status, role);
    res.status(201).send({ status: true, data: userId, message: 'User added successfully' });
    console.log(userId);
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).send({ status: false, message: 'User already exists' });
    }
    res.status(500).send({ status: false, message: error.message });
  }
};

// Get user details
const userDetailsHandler = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch user details
    const userData = await userDetails(user_id);
    if (!userData) {
      return res.status(404).send({ status: false, message: 'User not found' });
    }

    // Fetch user firms
    const userFirms = await getUserFirms(user_id);

    // Prepare response data
    const responseData = {
      ...userData,
      firms: userFirms // Add list of firm IDs to the user object
    };

    // Send response
    res.status(200).send({ status: true, data: responseData });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// Update user details
const updateUserDetailsHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, email, password, contact, address, status, role } = req.body;

    if (!name || !email || !password || !contact || !address || !status || !role) {
      return res.status(400).send({ status: false, message: 'All fields are required' });
    }

    await updateUserDetails(user_id, name, email, password, contact, address, status, role);
    res.status(200).send({ status: true, message: 'User details updated successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// Delete user
const deleteUserHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    await deleteUser(user_id);
    res.status(200).send({ status: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// Assign firm to user
const assignFirmToUserHandler = async (req, res) => {
  try {
    const { user_id, firm_id, added_by_user_id } = req.body;

    if (!user_id || !firm_id || !added_by_user_id) {
      return res.status(400).send({ status: false, message: 'user_id, firm_id, and added_by_user_id are required' });
    }

    if (!Array.isArray(firm_id)) {
      return res.status(400).send({ status: false, message: 'firm_id must be an array' });
    }

    await assignFirmToUser(user_id, firm_id, added_by_user_id);

    res.status(200).send({ status: true, message: 'Firms assigned to user successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


// // Update firm user
// const updateFirmUserHandler = async (req, res) => {
//   try {
//     const { uf_id } = req.params;
//     const { user_id, firm_ids, added_by_user_id } = req.body;

//     if (!user_id || !firm_ids || !Array.isArray(firm_ids) || added_by_user_id) {
//       return res.status(400).send({ status: false, message: 'user_id and firm_ids (array) are required' });
//     }

//     await updateFirmUser(uf_id, user_id, firm_ids, added_by_user_id);
//     res.status(200).send({ status: true, message: 'Firm user updated successfully' });
//   } catch (error) {
//     res.status(500).send({ status: false, message: error.message });
//   }
// };

// Update firm user
const updateFirmUserHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { selectedFirmIds, deselectedFirmIds, added_by_user_id } = req.body;

    if (!user_id || (!selectedFirmIds && !deselectedFirmIds) || !added_by_user_id) {
      return res.status(400).send({ status: false, message: 'User ID and firm selections are required' });
    }

    await updateFirmUser(user_id, selectedFirmIds, deselectedFirmIds, added_by_user_id);
    res.status(200).send({ status: true, message: 'Firm user updated successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


// Get firm user
const firmUserHandler = async (req, res) => {
  try {
    const { uf_id } = req.params;
    const firmUserDetails = await firmUser(uf_id);

    if (!firmUserDetails) {
      return res.status(404).send({ status: false, message: 'Firm user not found' });
    }

    res.status(200).send({ status: true, data: firmUserDetails });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



// Delete firm user
const deleteFirmUserHandler = async (req, res) => {
  try {
    const { uf_id } = req.params;
    await deleteFirmUser(uf_id);
    res.status(200).send({ status: true, message: 'Firm user deleted successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// Get users added by a specific user
const usersAddedByUserHandler = async (req, res) => {
  try {
    const { user_id } = req.params;
    const users = await usersAddedByUser(user_id);

    if (!users.length) {
      return res.status(404).send({ status: false, message: 'No users found for the given user_id' });
    }

    // Group users by user_id and merge associated data
    const groupedUsers = users.reduce((acc, user) => {
      const existingUser = acc.find(u => u.user_id === user.user_id);

      if (existingUser) {
        // If user_id already exists, push the firm details into the existing arrays
        existingUser.uf_id.push(user.uf_id);
        existingUser.firm_id.push(user.firm_id);
        existingUser.firm_name.push(user.firm_name);
      } else {
        // If user_id does not exist, create a new user object
        acc.push({
          user_id: user.user_id,
          usr_name: user.usr_name,
          usr_email: user.usr_email,
          usr_address: user.usr_address,
          usr_status: user.usr_status,
          uf_id: [user.uf_id],
          firm_id: [user.firm_id],
          firm_name: [user.firm_name],
        });
      }

      return acc;
    }, []);

    res.status(200).send({ status: true, data: groupedUsers });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
  registerYourself,
  loginUserHandler,
  addUserHandler,
  userDetailsHandler,
  updateUserDetailsHandler,
  deleteUserHandler,
  assignFirmToUserHandler,
  firmUserHandler,
  updateFirmUserHandler,
  deleteFirmUserHandler,
  usersAddedByUserHandler,
};
