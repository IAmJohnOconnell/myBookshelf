import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AddBookForm from "./components/AddBookForm";
import Booklist from "./pages/Booklist";
import Login from "./pages/login";
import Register from "./pages/Register";
import "./App.css";
import BookDatails from "./pages/BookDatails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Booklist />} />
        <Route path="/addBook" element={<AddBookForm />} />
        <Route path="/book/:title" element={<BookDatails />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </>
  );
}

export default App;
