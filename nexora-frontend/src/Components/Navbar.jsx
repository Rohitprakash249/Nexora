import { ShoppingCart } from "lucide-react";
import Drawer from "./Drawer";
import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  function navigateToCart() {
    navigate("/cart");
  }
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Drawer />
      </div>

      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Nexora Fashion</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <ShoppingCart
              style={{ cursor: "pointer" }}
              onClick={() => navigateToCart()}
            />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
  );
}
