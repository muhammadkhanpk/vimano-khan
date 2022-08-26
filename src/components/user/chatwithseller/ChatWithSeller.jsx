import React from "react";
import UserTopbar from "../../topbar/UserTopbar";
import CustomBottomBar from "../../bottombar/CustomBottomBar";
import "./chatwithseller.css";
import userProfile from "../../../assets/userProfile.png";
import {
  BsBell,
  BsTelephonePlus,
  BsPeople,
  BsEmojiSmile,
  BsMic,
  BsPaperclip,
} from "react-icons/bs";
import { FaLocationArrow } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { database } from "../../../firebase";
import { ref, update, child, push } from "firebase/database";
import useGetChatUID from "../../../hooks/useGetChatUID";
import useGetUserDetail from "../../../hooks/useGetUserDetail";
import useGetAllUserChats from "../../../hooks/useGetAllUserChats";
import useGetAllMsgs from "../../../hooks/useGetAllMsgs";
import { useEffect } from "react";

function ChatWithSeller() {
  const { user } = useSelector((state) => state.userReducer);
  //   const allUserChatsUID = useGetAllUserChats(user.uid);
  const currentUser = useGetUserDetail(user.uid);
  const { state } = useLocation();
  const adUser = state && state.adUser !== undefined ? state.adUser : {};

  const chatUID = useGetChatUID(user.uid, adUser.UID);
  const allMessages = useGetAllMsgs(chatUID);
  const [inputMsg, setInputMsg] = useState("");
  const sendMsg = () => {
    const inputVal = document.getElementById("msg-input-id").value;
    // console.log("chat uid is ", chatUID);
    // console.log("user id " + user.uid + " and ad user id " + adUser.UID);
    if (adUser.UID !== undefined && chatUID !== undefined) {
      if (inputVal !== "") {
        const messageUID = push(child(ref(database), "chatMessages")).key;
        const updates = {};
        updates["/chats/" + chatUID] = {
          chatUID,
          lastMessageSent: messageUID,
          members: [user.uid, adUser.UID],
        };
        updates["/chatMessages/" + chatUID + "/" + messageUID] = {
          sentBy: user.uid,
          message: inputMsg,
          msgTime: Date.now(),
          msgRead: false,
          name: currentUser.name,
        };
        updates["/userChats/" + user.uid + "/" + chatUID] = {
          chatUID,
          user: adUser,
        };
        updates["/userChats/" + adUser.UID + "/" + chatUID] = {
          chatUID,
          user: currentUser,
        };
        update(ref(database), updates);
        document.getElementById("msg-input-id").value = "";
      } else {
        alert("Non puoi mandare un messaggio vuoto :)");
      }
    } else {
      alert("You have no user to chat");
    }
  };

  useEffect(() => {
    var objDiv = document.getElementById("chat-all-msg");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [allMessages, chatUID]);

  // var inputChatMsg = document.getElementById("msg-input-id");
  // if (inputChatMsg !== null)
  //   inputChatMsg.addEventListener("keypress", (e) => {
  //     if (e.key === "Enter") {
  //       //e.preventDefault();
  //       document.getElementById("chat-icon-id").click();
  //     }
  //   });
  return (
    <div>
      <UserTopbar />
      <div className="app-container">
        <div className="chat">
          <div className="chat-msgs">
            <div className="chat-profile-msg">
              {adUser.img ? (
                <img src={adUser.img} alt="abc" />
              ) : (
                <img src={userProfile} alt="abc" />
              )}
              <h3>{adUser.name}</h3>
            </div>
            <div className="chat-all-msg" id="chat-all-msg">
              {allMessages.length > 0 &&
                allMessages.map((msg, index) => {
                  return (
                    <div>
                      <div
                        className={
                          user.uid === msg.sentBy
                            ? "sender-user"
                            : "receiver-user"
                        }
                        key={msg.sentBy + index}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="chat-input-menus">
              <div className="chat-input-menus-inner">
                <div className="chat-input-by-user">
                  {/* <BsEmojiSmile className="bs-emoji-icon" /> */}
                  <input
                    type="text"
                    id="msg-input-id"
                    className="chat-user-input"
                    onChange={(e) => {
                      setInputMsg(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMsg();
                      }
                    }}
                    placeholder="Scrivi qua il tuo messaggio"
                  />
                </div>

                <div className="chat-icons">
                  <FaLocationArrow
                    className="icon1"
                    onClick={sendMsg}
                    id="chat-icon-id"
                  />
                  {/* <BsMic className="icon1" />
                  <BsPaperclip className="clip1" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWithSeller;
