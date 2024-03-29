const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  description: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ _id: false, id: String, src: String }],
  videos: [
    {
      _id: false,
      id: String,
      src: String,
    },
  ],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };
