import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./custom_modal.css";
import { BsCheckLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CustomSuccessModal = ({ setModal, ad, message }) => {
  const navigate = useNavigate();
  const closeModal = () => {
    setModal(false);
    document.body.style.overflowY = "scroll";
    window.scrollTo(0, 0);
  };
  const onOK = () => {
    // navigate("/user/ad-detail/", {
    //   state: { ad, flag: true },
    // });
    document.body.style.overflowY = "scroll";
    window.scrollTo(0, 0);
    navigate("/");
  };
  return (
    <>
      <div className="overlay__background" onClick={closeModal}></div>
      <div className="custom__modal">
        <div className="custom_modal_upper_div">
          <div className="custom_modal_circle_s_div">
            <span className="s_icon">
              <BsCheckLg />
            </span>
          </div>
        </div>
        <div className="custom_modal_content_div">
          <div className="custom_modal_content_title_div">
            <h3>Grazie!</h3>
          </div>
          <div className="custom_modal_txt_div">
            <p>Il tuo vino è ora condiviso!</p>
          </div>
        </div>
        <div className="custom_modal_bottom_div">
          <div className="custom_modal_bottom_btn_div">
            <button className="butn close_btn" onClick={closeModal}>
              Chiudi
            </button>
            <button className="butn ok_btn" onClick={onOK}>
              Torna all’elenco
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomSuccessModal;
