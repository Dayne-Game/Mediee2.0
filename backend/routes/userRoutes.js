import express from "express";
const router = express.Router();

import {
  registerOwner,
  getUsers,
  authUser,
  registerStaff,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/owner").post(registerOwner);
router.post("/login", authUser);
router.route("/").get(protect, admin, getUsers);
router.route("/staff").post(protect, admin, registerStaff);

export default router;
