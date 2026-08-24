require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const { uniqueUsername } = require("../utils/username");

const PASSWORD = "QaScc2026!";
const QA_USERS = [
  { name: "QA Citizen", email: "qa.citizen.scc@example.com", role: "Citizen", department: "", city: "Pune", headline: "QA civic reporter" },
  { name: "QA Admin", email: "qa.admin.scc@example.com", role: "Admin", department: "Administration", city: "Pune", headline: "QA civic administrator" },
  { name: "QA Officer", email: "qa.officer.scc@example.com", role: "Officer", department: "Electricity", city: "Pune", headline: "QA electricity officer" },
  { name: "QA Staff", email: "qa.staff.scc@example.com", role: "Staff", department: "Electricity", city: "Pune", headline: "QA field worker" },
];

async function upsertUser(spec) {
  let user = await User.findOne({ email: spec.email }).select("+password");
  if (!user) {
    user = new User({
      ...spec,
      password: PASSWORD,
      username: await uniqueUsername(spec.name),
      active: true,
    });
    await user.save();
    return { email: spec.email, role: spec.role, action: "created", id: user._id.toString() };
  }
  user.name = spec.name;
  user.role = spec.role;
  user.department = spec.department;
  user.city = spec.city;
  user.headline = spec.headline;
  user.active = true;
  user.password = PASSWORD;
  if (!user.username) user.username = await uniqueUsername(spec.name);
  await user.save();
  return { email: spec.email, role: spec.role, action: "updated", id: user._id.toString() };
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const results = [];
  for (const spec of QA_USERS) {
    results.push(await upsertUser(spec));
  }
  console.log(JSON.stringify({ success: true, password: PASSWORD, users: results }, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
