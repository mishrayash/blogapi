import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const { blogId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/v1/blogs/${blogId}`)
      .then((response) => setBlog(response.data))
      .catch((error) => console.error("Error fetching blog:", error));
  }, [blogId]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-[550px]">
      <h2 className="mt-10 font-semibold text-3xl">{blog.description}</h2>
      <p className="my-10 text-xl">{blog.content}</p>
      <div>
        <h3>Images</h3>
        <ul>
          {blog.images.map((image) => (
            <li key={image.id}>
              <img src={image.src} alt={`Image ${image.id}`} />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Videos</h3>
        <ul>
          {blog.videos.map((video) => (
            <li key={video.id}>
              <video controls width="400" height="300">
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogDetails;
