const express = require("express");
const { Blog } = require("../models/blogModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:blogId", async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
