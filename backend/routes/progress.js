const express = require("express");
const { Blog } = require("../models/blogModel");
const { authMiddleware } = require("../middleware/auth");
const { Progress } = require("../models/progressModel");
const router = express.Router();
const { calculateProgress } = require("../utils/calculateProgress");

// Get progress of a blog
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

    res.json({ existingProgress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Total time spent on a blog
router.get("/time", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.body.blogId;

    if (!userId || !blogId) {
      return res.status(400).json({ message: "Invalid request" });
    }
    // Fetch existing progress record
    let existingProgress = await Progress.findOne({ userId, blogId });

    if (!existingProgress) {
      existingProgress = new Progress({
        userId,
        blogId,
        progress: 0,
      });
      await existingProgress.save();
    }

    // Return the total time spent
    res.json({ totalTimeSpent: existingProgress.totalTimeSpent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update progress of a blog
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.body.blogId;
    const { scrollPercentage, videoProgress } = req.body;

    if (!userId || !blogId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Validating scroll percentage
    if (scrollPercentage < 0 || scrollPercentage > 100) {
      return res.status(400).json({ message: "Invalid scroll percentage" });
    }

    // Fetch existing progress record
    let existingProgress = await Progress.findOne({ userId, blogId });

    if (!existingProgress) {
      // If no existing progress, create a new record
      existingProgress = new Progress({
        userId,
        blogId,
        progress: 0, // Default progress when creating a new record
        lastUpdatedTime: Date.now(),
        videos: [], // Initialize an empty array for videos
      });
    }

    const currentTime = Date.now();
    const timeSpentSinceLastUpdate =
      (currentTime - existingProgress.lastUpdatedTime) / 1000; // Convert milliseconds to seconds
    // console.log(
    //   timeSpentSinceLastUpdate,
    //   currentTime,
    //   existingProgress.lastUpdatedTime
    // );

    // Update total time spent
    existingProgress.totalTimeSpent += timeSpentSinceLastUpdate;

    // Update last updated time
    existingProgress.lastUpdatedTime = currentTime;

    // Iterate through videoProgress and update or add videos
    Object.entries(videoProgress).forEach(([videoId, currentVideoProgress]) => {
      if (currentVideoProgress < 0 || currentVideoProgress > 100) {
        return res.status(400).json({ message: "Invalid video progress" });
      }

      const existingVideo = existingProgress.videos.find(
        (v) => v.id === videoId
      );

      if (existingVideo) {
        // Video already exists in the progress, update if progress is greater
        if (currentVideoProgress > existingVideo.progress) {
          existingVideo.progress = currentVideoProgress;
        }
      } else {
        // Video doesn't exist in the progress, add it
        existingProgress.videos.push({
          id: videoId,
          progress: currentVideoProgress,
        });
      }
    });
    let newProgress = 0;
    if (existingProgress.videos.length !== 0) {
      let totalVideoProgress = 0;

      // Update overall video progress based on the average
      totalVideoProgress = existingProgress.videos.reduce(
        (sum, video) => sum + video.progress,
        0
      );
      newProgress = Math.round(
        totalVideoProgress / existingProgress.videos.length
      );
    }

    //taking max of scroll percentage and existing scroll percentage
    const maxi = Math.max(scrollPercentage, existingProgress.scrollPercentage);

    // calculate total percentage
    newProgress = Math.round(newProgress * 0.5 + maxi * 0.5);
    // console.log(newProgress, maxi, existingProgress.progress);

    if (newProgress <= existingProgress.progress) {
      return res.json({ message: "Progress cannot decrease" });
    }
    // Save the updated progress
    existingProgress.progress = newProgress;
    existingProgress.scrollPercentage = maxi;

    await existingProgress.save();

    res.json({ message: "Progress updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
