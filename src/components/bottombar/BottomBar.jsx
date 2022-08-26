import React from "react";
import { NavLink } from "react-router-dom";
import "./bottombar.css";
import {
  AiOutlineFacebook,
  AiOutlineLinkedin,
  AiOutlineTwitter,
  AiOutlineYoutube,
  AiOutlineInstagram,
} from "react-icons/ai";
function BottomBar() {
  return (
    <>
      <div className="bottom-bar-container">
        <div className="bottom-bar-description">
          <div className="about-vimano">
            <h3>About Vimano</h3>
            <NavLink to="" className="bottom-nav-links">
              About Us
            </NavLink>
            <NavLink to="" className="bottom-nav-links">
              Contact Us
            </NavLink>
            <NavLink to="" className="bottom-nav-links">
              Jobs
            </NavLink>
            <NavLink to="" className="bottom-nav-links">
              Vimano for Business
            </NavLink>
          </div>
          <div className="terms-conditions">
            <h3>Terms and Conditions</h3>
            <NavLink to="" className="bottom-nav-links">
              Help
            </NavLink>
            <NavLink to="" className="bottom-nav-links">
              Sitemap
            </NavLink>
            <NavLink to="" className="bottom-nav-links">
              Privacy Policy
            </NavLink>
            <NavLink to="" className="bottom-nav-links">
              Terms of Use
            </NavLink>
          </div>
          <div className="follow-us">
            <h3>Follow Us</h3>
            <div className="follow-us-icons">
              <div className="icons-circle">
                <NavLink to="" className="bottom-nav-links">
                  <AiOutlineTwitter />
                </NavLink>
              </div>
              <div className="icons-circle">
                <NavLink to="" className="bottom-nav-links">
                  <AiOutlineFacebook />
                </NavLink>
              </div>
              <div className="icons-circle">
                <NavLink to="" className="bottom-nav-links">
                  <AiOutlineYoutube />
                </NavLink>
              </div>
              <div className="icons-circle">
                <NavLink to="" className="bottom-nav-links">
                  <AiOutlineInstagram />
                </NavLink>
              </div>
              <div className="icons-circle">
                <NavLink to="" className="bottom-nav-links">
                  <AiOutlineLinkedin />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-bar-copyright">
          &copy;Vimano&trade; {new Date().getFullYear()}. All Rights Reserved.
        </div>
      </div>
    </>
  );
}

export default React.memo(BottomBar);
