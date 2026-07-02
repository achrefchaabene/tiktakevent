import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { connectDatabase } from "../config/database.js";

dotenv.config();

const name = process.env.ADMIN_NAME || "Admin";
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  process.exit(1);
}

await connectDatabase();

const exists = await Admin.findOne({ email });

if (exists) {
  console.log("Admin already exists");
  process.exit(0);
}

const hashedPassword = await bcrypt.hash(password, 10);
await Admin.create({ name, email, password: hashedPassword });

console.log("Admin created");
process.exit(0);

