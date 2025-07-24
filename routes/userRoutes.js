import express from "express";

import {
  deleteUser,
  updateUser,
  createUser,
  getUser,
  getUsers,
  signUp,
  signIn,
  getProfile,
} from "../controlers/usersControler.js";
import { auth } from "../middlware/auth.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/profile", auth, getProfile);
router.post("/", createUser);
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
