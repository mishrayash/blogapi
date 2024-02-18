const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  scrollPercentage: { type: Number, default: 0, min: 0, max: 100 },
  totalTimeSpent: { type: Number, default: 0 }, // Total time spent in seconds
  lastUpdatedTime: { type: Date, default: Date.now }, // Last updated time
  videos: [
    {
      _id: false,
      id: String,
      progress: { type: Number, default: 0, min: 0, max: 100 },
    },
  ],
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = { Progress };
