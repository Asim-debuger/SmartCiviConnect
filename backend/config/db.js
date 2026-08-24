const mongoose = require("mongoose");
const { isClerkAsset } = require("../utils/profileImage");

async function dropObsoleteClerkIndex() {
  const users = mongoose.connection.collection("users");
  try {
    const indexes = await users.indexes();
    const leftover = indexes.find((index) => index.name === "clerkId_1" || index.key?.clerkId);
    if (leftover) {
      await users.dropIndex(leftover.name);
      console.log("Dropped obsolete Clerk unique index from users");
    }
  } catch (error) {
    if (error.codeName !== "IndexNotFound" && error.code !== 27) {
      console.error("Could not drop obsolete Clerk index:", error.message);
    }
  }
}

async function stripClerkUserFields() {
  const users = mongoose.connection.collection("users");
  await users.updateMany(
    { $or: [{ clerkId: { $exists: true } }, { clerkImageUrl: { $exists: true } }, { clerk: { $exists: true } }] },
    { $unset: { clerkId: "", clerkImageUrl: "", clerk: "" } },
  );
  const withImages = await users.find({ profileImage: { $type: "string", $ne: "" } }).project({ profileImage: 1 }).toArray();
  const clerkImages = withImages.filter((user) => isClerkAsset(user.profileImage));
  if (clerkImages.length) {
    await users.updateMany(
      { _id: { $in: clerkImages.map((user) => user._id) } },
      { $unset: { profileImage: "" } },
    );
    console.log(`Cleared ${clerkImages.length} Clerk-hosted profile images`);
  }
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await dropObsoleteClerkIndex();
    await stripClerkUserFields();
    const { Job, Application } = require("../models/Job");
    const { migrateJobEnums } = require("../utils/jobStatus");
    await migrateJobEnums(Job, Application);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
