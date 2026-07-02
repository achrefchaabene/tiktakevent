import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.get("/setup-status", async (req, res, next) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.json({ canCreateAdmin: adminCount === 0 });
  } catch (error) {
    next(error);
  }
});

router.post("/setup-admin", async (req, res, next) => {
  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount > 0) {
      return res.status(403).json({ message: "Admin account already exists" });
    }

    const { name, email, password } = req.body;

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: "Email and password with at least 6 characters are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name: name || "Admin",
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
