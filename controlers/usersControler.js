import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: { usersProducts: { include: { product: true } } },
    });
    if (users.length === 0)
      return res.status(404).json({ message: "can not find any users" });
    res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong" });
  }
}

async function getUser(req, res) {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) return res.status(404).json({ message: "can not fidn user" });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function createUser(req, res) {
  try {
    console.log(req.body);
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email)
      return res
        .status(400)
        .json({ message: "please enter all required fields" });
    const user = await prisma.user.create({
      data: { firstName, lastName, email },
    });
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const { firstName, lastName, email } = req.body;
    const updated = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: { firstName, lastName, email },
    });
    if (!updated)
      return res.status(404).json({ message: "can not find product" });
    return res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
}
async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existingUser)
      return res.status(404).json({ message: "user  not found" });
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: "user  deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function signUp(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res
        .status(400)
        .json({ message: "please enter all required fields" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.json({ token });
  } catch (err) {
    console.log(err);
  }
}
async function getProfile(req, res) {
  const id = Number(req.body.user.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      lastName: true,
      firstName: true,
    },
  });
  if (!user) {
    return res.status(404).json({ error: "user do not exist" });
  }
  return res.json(user);
}

export {
  deleteUser,
  updateUser,
  createUser,
  getUser,
  getUsers,
  signUp,
  signIn,
  getProfile,
};
