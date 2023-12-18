const { resetPasswordMail } = require("../mailers/resetPassword_mailer");
const User = require("../models/user");
const Habit = require("../models/habit");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const passport = require("passport");

// Function to generate a random secret key
// const generateRandomSecretKey = () => {
//   return crypto.randomBytes(32).toString('hex'); // 32 bytes converts to a 64-character hex string
// };

// Generate a random secret key
const secretKey = "hellosirhowareyou";

// Function to decode JWT token
const decodeResetToken = (token) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // 'decoded' will contain the payload information
    return decoded;
  } catch (err) {
    // If the token is invalid or has expired, an error will be thrown
    console.error(err);
    return null;
  }
};
module.exports.profile = async function (req, res) {
  try {
    const userId = req.user._id;
    console.log(userId);

    // Fetch habits and populate the 'user' field
    const habits = await Habit.find({ user: userId }).populate('user'); // Update the populate field

    return res.render('user_profile', {
      title: 'User Profile',
      habits: habits,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};
//render signUp page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "Auth | Sign Up",
  });
};

//render singIn page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "Auth | Sign In",
  });
};

//get the sign up data
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Please Match the Password!");
    return res.redirect("back");
  }
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      const userCreate = await User.create(req.body);
      if (userCreate) {
        req.flash("success", "User created Successfully!");
        return res.redirect("/users/sign-in");
      }
    } else {
      req.flash("error", "User Already exist!");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", " Please try again.");
    return res.redirect("back");
  }
};

module.exports.createSession = async function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/users/profile");
};

//destroy session

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return console.log(err);
    }
    req.flash("success", "You have logged out!");

    return res.redirect("/");
  });
};

//for password reset
exports.passwordReset = (req, res, next) => {
  try {
    const email = req.body.email;
    const userId = req.body.userId;

    // Generate JWT token
    const resetToken = generateResetToken(email);
    const resetLink = `http://localhost:8000/users/reset-password/${resetToken}`;

    // Send the resetToken to the user (e.g., via email)
    resetPasswordMail(
      email,
      "Password Reset",
      `Use the following link to reset your password: ${resetLink}`
    );
    req.flash("success", "Password reset link sent to you Email");
  } catch (err) {
    console.log(err);
  }

  return res.redirect("back");
};

// Function to generate JWT token
const generateResetToken = (userId) => {
  const payload = { userId };
  const options = { expiresIn: "1h" }; // Set an expiration time for the token
  return jwt.sign(payload, secretKey, options);
};

// password reset link
exports.passwordResetLink = (req, res) => {
  const resetToken = req.params.token;
  // Decode the token for demonstration purposes
  const decodedToken = decodeResetToken(resetToken);

  return res.render("reset-password", {
    title: "Password Reset",
    token: resetToken,
    email: decodedToken.email,
  });
};
exports.updatePassword = async (req, res) => {
  const resetToken = req.params.token;

  // Decode the token for demonstration purposes
  const decodedToken = decodeResetToken(resetToken);
  console.log(decodedToken);
  if (!decodedToken) {
    req.flash("error", "invalid link!");
    return res.redirect("back");
  }
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Please Match the Password!");
    return res.redirect("back");
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: decodedToken.userId },
      { password: req.body.password },
      { new: true }
    );

    if (!updatedUser) {
      req.flash("error", "Error updating password. User not found.");
      return res.redirect("back");
    }
    // Check if the resetToken property exists before attempting to update it
    if (updatedUser.resetToken) {
      // Expire the reset token immediately
      updatedUser.resetToken.expires = new Date();
      await updatedUser.save();
      req.flash("success", "Password reset successfully");
    }

    return res.redirect("/users/sign-in");
  } catch (error) {
    req.flash("error", "Error updating password. Please try again.");
    return res.redirect("back");
  }
};

exports.forgetPasswordRender = (req, res) => {
  const user = User.findOne({ email: req.body.email });
  return res.render("forgot-password", {
    title: "Forgot password",
    user,
  });
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Email not found!");
      return res.redirect("back");
    }
    // Generate JWT token
    const resetToken = generateResetToken(email);

    const resetLink = `http://localhost:8000/users/reset-password/${resetToken}`;

    // Send the resetToken to the user (e.g., via email)

    resetPasswordMail(
      email,
      "Password Reset",
      `Use the following link to reset your password: ${resetLink}`
    );
    return res.redirect("back");
  } catch (error) {
    req.flash("error", " Please try again.");
    return res.redirect("back");
  }
};
