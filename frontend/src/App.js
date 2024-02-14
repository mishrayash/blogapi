import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlogList from "./components/BlogList";
import BlogPage from "./components/BlogPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/:blogId" element={<BlogPage />} />
      </Routes>
    </Router>
  );
};

export default App;
