import React, { useState, useEffect } from "react";
import logo_vimano from "../../assets/logo_vimano.png";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineLogout, AiOutlinePlusSquare } from "react-icons//ai";
import { BsFillChatLeftTextFill, BsListUl } from "react-icons/bs";
import userProfile from "../../assets/userProfile.png";
import "./usertopbar.css";
import { userSuccess } from "../../Redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { auth, database } from "../../firebase";
import useGetUserDetail from "../../hooks/useGetUserDetail";
import useGetAllUnReadMsgsByUID from "../../hooks/useGetAllUnReadMsgsByUID";
import { Alert } from "@mui/material";

import beep from "../../assets/w10Beep.mp3";
import { update, child, ref } from "firebase/database";
function UserTopbar() {
  const { user } = useSelector((state) => state.userReducer);
  const orignalUser = useGetUserDetail(user.uid);
  const allUnReadMsgs = useGetAllUnReadMsgsByUID(user.uid);
  const [open, setOpen] = useState(false);
  const [alretCount, setAlertCount] = useState(0);

  // console.log("all unread msgs", allUnReadMsgs);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(false);
  const handleAdClick = () => {
    if (
      orignalUser.location !== "" &&
      orignalUser.location !== undefined &&
      orignalUser.locationName !== "" &&
      orignalUser.locationName !== undefined &&
      orignalUser.cell !== "" &&
      orignalUser.cell !== undefined
    ) {
      navigate("/user/new-ad");
    } else {
      alert("Please complete profile first");
      // update(child(ref(database), "AllUsers/" + user.uid + "/user"), {
      //   locationName: "",
      // });
      navigate("/user/edit-profile");
    }
  };
  const handleLogout = () => {
    auth.signOut().then(() => {
      dispatch(userSuccess({}));
      navigate("/");
    });
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useEffect(() => {
    // var sound = new Audio(beep);
    // const isAlert = JSON.parse(sessionStorage.getItem('isAlret'));
    if (allUnReadMsgs && allUnReadMsgs.length > 0) {
      // sound.play();
      setOpen(true);
      // if (isAlert !== null && isAlert === true) {

      //    sessionStorage.setItem("isAlret", JSON.stringify(false));
      // }
    }
  }, [allUnReadMsgs]);

  return (
    <>
      <div className="topBar">
        {open && (
          <div className="noti">
            {allUnReadMsgs &&
              allUnReadMsgs.length > 0 &&
              allUnReadMsgs.map((v, i, arr) => {
                if (i + 1 === arr.length) {
                  return (
                    <div className="notification_div" key={i}>
                      <div id="hide">
                        <div id={`msg${i}`} className="msg_div">
                          <Alert
                            onClose={(e) => {
                              let element = document.getElementById(`msg${i}`);
                              element.style.display = "none";
                            }}
                            severity="info"
                            sx={{ width: "100%" }}
                          >
                            <h5>{v.name}</h5>
                            <div>
                              {v.message.slice(0, 18)}
                              {v.message.length > 18 ? <span>...</span> : <></>}
                            </div>
                          </Alert>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        )}

        <div className="logo" onClick={() => navigate("/user")}>
          <img src={logo_vimano} alt="Vimano" />
        </div>
        <div className="navbar-container">
          <span to="/user/new-ad" className="vm-item" onClick={handleAdClick}>
            <AiOutlinePlusSquare className="icon-x" />
          </span>
          <div className="profile" onClick={() => setMenu(!menu)}>
            {orignalUser.img ? (
              <img className="profile_img" src={orignalUser.img} />
            ) : (
              <img src={userProfile} />
            )}
            {menu && (
              <div className="menu">
                <div className="menu-profile">
                  {orignalUser.img ? (
                    <img className="profile_img" src={orignalUser.img} />
                  ) : (
                    <img src={userProfile} />
                  )}
                  <div className="menu-profile-links">
                    {orignalUser.email ? (
                      <p>{orignalUser.name}</p>
                    ) : (
                      <p>Khan</p>
                    )}

                    <NavLink to="/user/edit-profile" className="edit-profile">
                      Profilo Utente
                    </NavLink>
                  </div>
                </div>
                <div className="menu-links">
                  {/* <hr className="hr1" /> */}
                  <NavLink to="/user/ads-list" className="align-navlinks">
                    <BsListUl className="icon-style" />
                    Miei Post & Vini Preferiti
                  </NavLink>
                  {/* <hr className="hr1" />
                  <NavLink to="" className="align-navlinks">
                    <BsQuestionCircle className="icon-style" />
                    Need Help ?
                  </NavLink>
                  <hr className="hr1" />
                  <NavLink to="adds" className="align-navlinks">
                    <AiOutlineSetting className="icon-style" />
                    Settings
                  </NavLink> */}
                  {/* <hr className="hr1" /> */}
                  <p className="align-navlinks" onClick={handleLogout}>
                    <AiOutlineLogout className="icon-style" />
                    Logout
                  </p>
                  {/* <hr className="hr1" /> */}
                </div>
              </div>
            )}
          </div>
          <NavLink to="/user/chat" className="user-chat">
            <BsFillChatLeftTextFill className="icon-xx" />
            {allUnReadMsgs && allUnReadMsgs.length > 0 && (
              <p className="msg-count">{allUnReadMsgs.length}</p>
            )}
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default React.memo(UserTopbar);
