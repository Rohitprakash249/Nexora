import "./App.css";
import { Route, Routes, useNavigate } from "react-router";
import Cart from "./Components/Cart";
import { Toaster } from "react-hot-toast";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HomePage from "./Components/Homepage";

function App() {
  return (
    <>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
