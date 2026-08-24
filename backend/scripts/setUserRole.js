require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const [, , email, role] = process.argv;
const roles = ["Citizen", "Staff", "Officer", "Head Officer", "Admin", "Super Admin"];

if (!email || !roles.includes(role)) {
  console.error(`Usage: node scripts/setUserRole.js <email> "<role>"`);
  console.error(`Roles: ${roles.join(", ")}`);
  process.exit(1);
}

async function run() {
  await connectDB();
  const user = await User.findOneAndUpdate(
    { email: String(email).trim().toLowerCase() },
    { role },
    { new: true },
  );
  if (!user) throw new Error("User not found. Register/login once so the MongoDB profile exists first.");
  console.log(`Updated ${user.email} to ${user.role}`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
