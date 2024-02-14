const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = { Progress };
