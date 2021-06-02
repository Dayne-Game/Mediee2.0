import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      owner: user.owner,
      isOwner: user.isOwner,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @DESC    REGISTER RESTHOME/COMPANY OWNER
// @ROUTE   POST /api/users/owner
// @ACCESS  PUBLIC
const registerOwner = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Get User Email
  const userEmailExists = await User.findOne({ email });

  // Check user email
  if (userEmailExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create Owner
  const owner = await User.create({
    name,
    email,
    password,
    isOwner: true,
    isAdmin: true,
  });

  if (owner) {
    res.status(201).json({
      _id: owner._id,
      name: owner.name,
      isOwner: owner.isOwner,
      isAdmin: owner.isAdmin,
      token: generateToken(owner._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Owner data");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  if (req.user.isOwner === true) {
    const ownerStaff = await User.find({});
    res.json(ownerStaff);
  } else if (req.user.isAdmin === true && req.user.isOwner === false) {
    const adminStaff = await User.find({ owner: req.user.owner });
    res.json(adminStaff);
  } else {
    res.status(401);
    throw new Error("You don't have the permission to do this!");
  }
});

// @DESC    REGISTER STAFF MEMBER
// @ROUTE   POST /api/users/staff
// @ACCESS  PRIVATE
const registerStaff = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  // Get User Email
  const userExists = await User.findOne({ email });
  // Check user email
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create Staff
  const user = await User.create({
    name,
    email,
    password,
    owner: req.user._id,
    isAdmin,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      isOwner: user.isOwner,
      owner: user.owner,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

export { registerOwner, getUsers, authUser, registerStaff };
