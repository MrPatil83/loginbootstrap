// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import React Router
import Login from "./components/Login/Login";

import Navbar from "./components/Navbar/Navbar";
// import NavbarList from "./NavbarList";

export default function App() {
  return (
    <Router>
      {/* Include NavbarList at the top */}
      {/* <NavbarList /> */}
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}
