import React from "react";
import { BrowserRouter, Route, Routes, HashRouter } from "react-router-dom";
import Home from "./Home";
import Post from "./Post";
import Create from "./Create";
import Login from "./Login";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/SoundSpot" element={<Home />} />
          <Route path="/SoundSpot/Create" element={<Create />} />
          <Route path="/SoundSpot/post/:postId" element={<Post />} />
          <Route path="/SoundSpot/Login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
