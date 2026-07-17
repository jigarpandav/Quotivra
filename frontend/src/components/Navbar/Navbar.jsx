import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GrFormView } from "react-icons/gr";
import {
  FaBars,
  FaBuilding,
  FaChartPie,
  FaFileInvoice,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import logo from "../../assets/images/quotivra.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Adminid");
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="nav-container">
      <div className="nav-header">
        <div className="nav-logo">
          <div className="logo-frame">
            <img src={logo} alt="Quotivra logo" />
          </div>
          <div className="nav-brand">
            <span>Quotivra</span>
            <p>Smart Quotation System</p>
          </div>
        </div>

        <button
          type="button"
          className="nav-menu-toggle"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/dashboard" onClick={closeMenu}>
            <FaChartPie />
            Dashboard
          </NavLink>

          <NavLink to="/quotations" onClick={closeMenu}>
            <FaFileInvoice />
            Quotations
          </NavLink>

          <NavLink to="/quotations/view" onClick={closeMenu}>
            <GrFormView />
            View Quotations
          </NavLink>

          <NavLink to="/company-setting" onClick={closeMenu}>
            <FaBuilding />
            Company Setting
          </NavLink>

          <NavLink to="/company-setting/view" onClick={closeMenu}>
            <FaBuilding />
          View Company Setting
          </NavLink>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        <div className="nav-user" aria-label="Current user">
          <FaUser />
          <span>JP</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
