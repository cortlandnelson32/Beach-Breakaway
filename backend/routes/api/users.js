// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup, // Use existing validation logic
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    try {
      const existingEmail = await User.findOne({ where: { email } });
      const existingUsername = await User.findOne({ where: { username } });

      if (existingEmail || existingUsername)   
 {
        const errors = {};
        if (existingEmail) errors.email = "User with that email already exists";
        if (existingUsername) errors.username = "User with that username already exists";
        return res.status(500).json({ message: "User already exists", errors });
      }

      const user = await User.create({ firstName, lastName, email, username, hashedPassword });

      const safeUser = {
        id: user.id,
        firstName:   
 user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.status(201).json({
        user: safeUser   

      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ message: 'An error occurred' }); // Generic error message for user
    }
  }
);

// Add the following validation functions to your models/User.js file:
async function validateEmail(email) {
  try {
    const existingUser = await User.findOne({ where: { email } });
    return !existingUser; // Email is valid if no existing user found
  } catch (error) {
    console.error(error);
    return false; // Assume error means email is invalid
  }
}

async function validateUsername(username) {
  try {
    const existingUser = await User.findOne({ where: { username } });
    return !existingUser; // Username is valid if no existing user found
  } catch (error) {
    console.error(error);
    return false; // Assume error means username is invalid
  }
}


module.exports = router;
