import React, { useEffect, useState } from "react";
import BottomBar from "../../components/bottombar/BottomBar";
import HomeListing from "../../components/home/HomeListing";
import UserTopbar from "../../components/topbar/UserTopbar";
import CookieConsent from "react-cookie-consent";
import "./user.css";
import { useSelector } from "react-redux";
import useGetAllUserChats from "../../hooks/useGetAllUserChats";
import { database } from "../../firebase";
import { get, ref, remove, child } from "firebase/database";
function User() {
  const { user } = useSelector((state) => state.userReducer);
  const userChatsUIDs = useGetAllUserChats(user.uid);
  const deleteEmptyChatUIDsFromMessages = () => {
    userChatsUIDs.forEach((chatUID) => {
      console.log("messages found this chat uid ", chatUID.chatUID);

      let q = ref(database, "chatMessages/" + chatUID.chatUID);
      get(q)
        .then((snap) => {
          if (snap.exists()) {
            //console.log("messages found this chat uid ", chatUID.chatUID);
          } else {
            let cuid = chatUID.chatUID;
            remove(
              child(ref(database), "userChats/" + user.uid + "/" + cuid)
            ).then(() => {});
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  useEffect(() => {
    userChatsUIDs.length > 0 && deleteEmptyChatUIDsFromMessages();
  }, [userChatsUIDs]);
  return (
    <div>
      <UserTopbar />

      <div className="app-container ">
        <div id="google_translate_element"></div>
        <CookieConsent
          location="bottom"
          className="cookies"
          buttonText="Accept"
          cookieName="Accept"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.{" "}
          <span style={{ fontSize: "10px" }}></span>
        </CookieConsent>
        <HomeListing />
      </div>
      <BottomBar />
    </div>
  );
}

export default User;
