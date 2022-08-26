import React from "react";
import logo_vimano from "../../assets/logo_vimano.png";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlinePlusSquare } from "react-icons//ai";

import "./topbar.css";
function TopBar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="topBar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo_vimano} alt="Vimano" />
        </div>
        <div className="navbar-container">
          <p to="" className="vm-item">
            <AiOutlinePlusSquare
              className="icon"
              onClick={() => {
                alert("Devi registrati prima di poter vendere i tuoi vini");
                navigate("/signup");
              }}
            />
          </p>
          <NavLink to="/signin" className="vm-item">
            Login
          </NavLink>
          <NavLink to="/signup" className="vm-item">
            Registrati
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default React.memo(TopBar);
