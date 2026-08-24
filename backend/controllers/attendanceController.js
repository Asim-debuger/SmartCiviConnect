const Attendance = require("../models/Attendance");

function today() {
  return new Date().toISOString().slice(0, 10);
}

exports.listMine = async (req, res, next) => {
  try {
    const records = await Attendance.find({ userId: req.auth.userId }).sort({ date: -1 }).limit(60).lean();
    res.json({ success: true, records });
  } catch (error) { next(error); }
};

exports.checkIn = async (req, res, next) => {
  try {
    const date = today();
    const record = await Attendance.findOneAndUpdate(
      { userId: req.auth.userId, date },
      { $setOnInsert: { checkInAt: new Date(), checkInLocation: req.body.location || undefined } },
      { new: true, upsert: true },
    );
    res.json({ success: true, record });
  } catch (error) { next(error); }
};

exports.checkOut = async (req, res, next) => {
  try {
    const record = await Attendance.findOne({ userId: req.auth.userId, date: today() });
    if (!record?.checkInAt) return res.status(409).json({ success: false, message: "Check in first" });
    record.checkOutAt = new Date();
    if (req.body.location) record.checkOutLocation = req.body.location;
    await record.save();
    res.json({ success: true, record });
  } catch (error) { next(error); }
};
