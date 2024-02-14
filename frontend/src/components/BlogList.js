import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/v1/blogs/")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error("Error fetching blogs:", error));

    console.log(blogs);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold flex justify-center mt-8 ">
        All Blogs
      </h2>
      <ul className="text-2xl m-4 flex justify-center ">
        {blogs.map((blog) => (
          <li key={blog._id} className="pb-2 border-t-2 w-[200px]">
            <Link to={`/${blog._id}`}>{blog.description}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
