import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./custom_modal.css";
import { BsCheckLg } from "react-icons/bs";

const CustomErrorModal = ({ setModal }) => {
  const closeModal = () => {
    setModal(false);
    document.body.style.overflowY = "scroll";
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="overlay__background" onClick={closeModal}></div>
      <div className="custom__modal">
        <div className="custom_modal_upper_div">
          <div className="custom_modal_circle_e_div">
            <span className="s_icon">
              <AiOutlineClose />
            </span>
          </div>
        </div>
        <div className="custom_modal_content_div">
          <div className="custom_modal_content_title_div">
            <h3>Sorry!</h3>
          </div>
          <div className="custom_modal_txt_div">
            <p>Your Ad is not posted due to some logical error.</p>
          </div>
        </div>
        <div className="custom_modal_bottom_div">
          <div className="custom_modal_bottom_btn_div">
            <button className="butn close_btn" onClick={closeModal}>
              Try Again
            </button>
            {/* <button className="butn ok_btn">Go to Listing</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomErrorModal;
