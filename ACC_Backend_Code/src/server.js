const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');


const app = express();
app.use(cors());
const port = process.env.PORT || 3007;

app.use(bodyParser.json());

// Public routes (registration and login)
app.use('/api/users', userRoutes.publicRoutes);

// Protected routes (requires authentication)
app.use(authMiddleware);
// app.use('/api/users', userRoutes.protectedRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
