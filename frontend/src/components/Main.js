import React from "react";
import { post } from "../data";
import BlogPost from "./BlogPost";
import BlogList from "./BlogList";
const Main = () => {
  return (
    <div className="mt-16 p-[34px]">
      <BlogList />
    </div>
  );
};

export default Main;
