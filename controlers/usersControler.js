import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";
import { text } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sendMail from "../utils/emailService.js";

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
      include: {
        roles: true,
        otp: true,
      },
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    delete user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.roles.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.json({ message: "user sign in succesfully", user, token });
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
async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  if (!user.otpId) {
    const createdOtp = await prisma.otp.create({
      data: {
        otpCode,
        otpExpiry,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: { connect: { id: createdOtp.id } },
      },
    });
  } else {
    await prisma.otp.update({
      where: { id: user.otpId },
      data: {
        otpCode,
        otpExpiry,
      },
    });
  }

  ///////////////////  sending mail

  try {
    await sendMail(
      email,
      "password reset otp code",
      `<h1>Password Reset OTP Code</h1>
      <p>You requested a password reset. Use the following OTP code to reset your password:</p>
      <h2 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center;">${otpCode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>`
    );
    res
      .status(201)
      .json({ message: "otp code have been send, please check email" });
  } catch (err) {
    console.log("error while senidign error", err);
    return res.status(501).json({ message: "failed to send email" });
  }
}

async function resetPassword(req, res) {
  const { email, otpCode, newPassword } = req.body;
  const maxAtemps = 5;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { otp: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.otp.otpCount >= maxAtemps) {
    await prisma.otp.update({
      where: { id: user.otp.id },
      data: {
        otpCode: null,
        otpExpiry: null,
        otpCount: 0,
      },
    });
    return res
      .status(429)
      .json({ message: "too many false attemps, please request new OTP" });
  }
  if (user.otp.otpExpiry < new Date()) {
    return res.status(400).json({ message: "OTP has expired" });
  }
  if (otpCode !== user.otp.otpCode) {
    await prisma.otp.update({
      where: { id: user.otp.id },
      data: {
        otpCount: { increment: 1 },
      },
    });
    const remaining = maxAtemps - user.otp.otpCount;
    return res.status(400).json({
      message: `Invalid OTP code. ${remaining} attempts remaining.`,
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  await prisma.otp.update({
    where: { id: user.otpId },
    data: {
      otpCode: null,
      otpExpiry: null,
    },
  });

  res.status(201).json({ message: "password updated successfuly" });
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
  forgotPassword,
  resetPassword,
};
