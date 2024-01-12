import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Post from "./Post";
import Create from "./create";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/post/:postId" element={<Post />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
