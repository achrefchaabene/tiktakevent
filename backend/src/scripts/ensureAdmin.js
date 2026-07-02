import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export async function ensureAdminFromEnv() {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const exists = await Admin.findOne({ email });

  if (exists) {
    console.log("Admin account already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({ name, email, password: hashedPassword });
  console.log("Admin account created from environment variables");
}
