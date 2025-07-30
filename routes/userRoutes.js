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
import { auth, isAdmin } from "../middlware/auth.js";

const router = express.Router();

router.get("/", auth, isAdmin, getUsers);
router.post("/profile", auth, isAdmin, getProfile);
router.post("/", auth, isAdmin, createUser);
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/:id", auth, isAdmin, getUser);
router.put("/:id", auth, isAdmin, updateUser);
router.delete("/:id", auth, isAdmin, deleteUser);

export default router;
