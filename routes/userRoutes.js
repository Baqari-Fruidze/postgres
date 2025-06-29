import express from "express";

import {
  deleteUser,
  updateUser,
  createUser,
  getUser,
  getUsers,
} from "../controlers/usersControler.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
