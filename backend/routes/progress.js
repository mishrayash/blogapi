const express = require("express");
const { Blog } = require("../models/blogModel");
const { authMiddleware } = require("../middleware/auth");
const { Progress } = require("../models/progressModel");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.body.blogId;

    // console.log(userId, blogId);

    let existingProgress = await Progress.findOne({ userId, blogId });

    if (!existingProgress) {
      existingProgress = new Progress({
        userId,
        blogId,
        progress: 0,
      });
      await existingProgress.save();
    }

    res.json({ progress: existingProgress.progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.body.blogId;
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.json({ message: "Invalid Progress" });
    }
    // console.log(userId, blogId, progress);

    let existingProgress = await Progress.findOne({ userId, blogId });

    if (!existingProgress) {
      existingProgress = new Progress({
        userId,
        blogId,
        progress,
      });
      await existingProgress.save();
    } else {
      if (progress <= existingProgress.progress) {
        return res.json({ message: "Progress Cannot Decrease" });
      }
      existingProgress.progress = progress;
      await existingProgress.save();
    }

    res.json({ message: "Progress updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
