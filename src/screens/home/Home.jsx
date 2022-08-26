import React from "react";
import BottomBar from "../../components/bottombar/BottomBar";
import TopBar from "../../components/topbar/TopBar";
import { AiOutlineSearch } from "react-icons/ai";
import "./home.css";
import HomeListing from "../../components/home/HomeListing";
import CookieConsent from "react-cookie-consent";

function Home() {
  return (
    <div>
      <TopBar />

      <div className="vimano_container_">
        <CookieConsent
          location="bottom"
          className="cookies"
          buttonText="Accept"
          cookieName="vimano-site"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.
          <span style={{ fontSize: "10px" }}></span>
        </CookieConsent>
        <div className="app-container">
          <HomeListing />
        </div>
      </div>
      <BottomBar />
    </div>
  );
}

export default Home;
