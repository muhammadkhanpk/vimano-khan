import React from "react";
import UserTopbar from "../../topbar/UserTopbar";
import CustomBottomBar from "../../bottombar/CustomBottomBar";
import "./chat.css";
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
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { database } from "../../../firebase";
import { ref, update, child, push, onValue, get } from "firebase/database";
import useGetChatUID from "../../../hooks/useGetChatUID";
import useGetUserDetail from "../../../hooks/useGetUserDetail";
import useGetAllUserChats from "../../../hooks/useGetAllUserChats";
import useGetAllMsgs from "../../../hooks/useGetAllMsgs";
import useGetUserToWhomIamChat from "../../../hooks/useGetUserToWhomIamChat";
import { userUpdate } from "../../../Redux/Actions/userActions";
import { useEffect } from "react";

function Chat() {
  window.scrollTo(0, 0);
  const dispatch = useDispatch();
  const { user, updateUser } = useSelector((state) => state.userReducer);
  const allUserChatsUID = useGetAllUserChats(user.uid);
  const currentUser = useGetUserDetail(user.uid);
  const [currentChatUID, setCurrentChatUID] = useState("");
  const chat_2nd_user = useGetUserToWhomIamChat(user.uid, currentChatUID);

  const chatUID = useGetChatUID(
    user.uid,
    // allUserChatsUID &&
    //   allUserChatsUID[0] !== undefined &&
    //   allUserChatsUID[0].user !== undefined &&
    //   allUserChatsUID[0].user.UID
    chat_2nd_user && chat_2nd_user.UID !== undefined && chat_2nd_user.UID
  );

  const allMessages = useGetAllMsgs(currentChatUID);
  // console.log("abc user " + JSON.stringify(chat_2nd_user));
  // console.log("current chat uid is ", currentChatUID);
  //console.log("ALL MESSAGES " + JSON.stringify(allMessages));

  ///console.log("All messages " + JSON.stringify(allMessages.length));

  const [inputMsg, setInputMsg] = useState("");
  const [search, setSearch] = useState("");

  const getChatMsgs = async (e, chatUid) => {
    setCurrentChatUID(chatUid.chatUID);

    get(ref(database, "chatMessages/" + chatUid.chatUID)).then((snap) => {
      if (snap.exists()) {
        // alert(JSON.stringify(chatUid, null, 5));

        let keys = Object.keys(snap.val());
        Object.values(snap.val()).forEach(async (chat, i) => {
          if (chat.sentBy !== user.uid) {
            await update(
              child(
                ref(database),
                "chatMessages/" + chatUid.chatUID + "/" + keys[i]
              ),
              {
                msgRead: true,
              }
            ).then(() => {
              dispatch(userUpdate(!updateUser));
            });
          }
        });
      }
    });
  };

  const sendMsg = () => {
    if (currentChatUID !== undefined && chat_2nd_user !== undefined) {
      const inputVal = document.getElementById("msg-input-id").value;
      if (inputVal !== "") {
        const messageUID = push(child(ref(database), "chatMessages")).key;
        const updates = {};
        updates["/chats/" + chatUID] = {
          chatUID,
          lastMessageSent: messageUID,
          members: [user.uid, chat_2nd_user.UID],
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
          user: chat_2nd_user,
        };
        updates["/userChats/" + chat_2nd_user.UID + "/" + chatUID] = {
          chatUID,
          user: currentUser,
        };

        update(ref(database), updates);
        document.getElementById("msg-input-id").value = "";
        let element = document.getElementById("chat-all-msg");
        element.scroll({ top: element.scrollHeight, behavior: "smooth" });
        // document.getElementById("msg-input-id").focus();
        // var objDiv = document.getElementById("chat-all-msg");
        // objDiv.scrollTop = objDiv.scrollHeight;
      } else {
        alert("Non puoi mandare un messaggio vuoto :)");
      }
    } else {
      alert("something is wrong");
      //alert(currentChatUID);
    }
  };

  useEffect(() => {
    setCurrentChatUID(chatUID);
    var objDiv = document.getElementById("chat-all-msg");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [chatUID]);

  const [unRead, setUnRead] = useState([]);
  const getMessageCounts = (userChatUID) => {
    let c = 0;
    onValue(ref(database, "chatMessages/" + userChatUID.chatUID), (snap) => {
      if (snap.exists()) {
        const unReadMsgs = Object.values(snap.val()).filter(
          (msg) => msg.msgRead === false && msg.sentBy === userChatUID?.user.UID
        );
        // console.log("unread msgs ", unReadMsgs);
        c = unReadMsgs.length;
      }
    });
    return c;
  };

  return (
    <div>
      <UserTopbar />
      <div className="app-container">
        <div className="chat">
          <div className="chat-contact">
            <div className="search">
              <input
                type="text"
                className="input-field"
                placeholder="Cerca utente"
                onChange={(e) => setSearch(e.target.value)}
              />
              <AiOutlineSearch className="search-icon" />
            </div>
            <div className="chat-people">
              {allUserChatsUID.length > 0 &&
                allUserChatsUID
                  .filter((val, inde) => {
                    if (search == "") {
                      return val;
                    } else if (
                      val.user.name
                        .toLowerCase()
                        .includes(search.toString().toLowerCase())
                    ) {
                      return val;
                    }
                  })
                  .map((userChatUID, index) => {
                    {
                      /* console.log("imgs") */
                    }
                    return (
                      <div
                        className="card-p"
                        key={userChatUID + index}
                        onClick={(e) => {
                          getChatMsgs(e, userChatUID);
                        }}
                      >
                        <img src={userProfile} />
                        <h5 className="name">{userChatUID?.user.name}</h5>
                        {getMessageCounts(userChatUID) > 0 && (
                          <p className="seprate-msg-count">
                            {getMessageCounts(userChatUID)}
                          </p>
                        )}
                        {/* <p className="seprate-msg-count">
                          {getMessageCounts(userChatUID)}
                        </p> */}
                      </div>
                    );
                  })}
            </div>
            {/* <div className="bottom-chat-contact">
              <div className="bottom-chat-menus">
                <div className="menus-detail">
                  <BsBell className="icon-styles" />
                  <p>Notifications</p>
                </div>
                <div className="menus-detail">
                  <BsTelephonePlus className="icon-styles" />
                  <p>Calls</p>
                </div>
                <div className="menus-detail">
                  <BsPeople className="icon-styles" />
                  <p>Contacts</p>
                </div>
              </div>
            </div> */}
          </div>

          <div className="chat-msgs-a">
            {chat_2nd_user && (
              <div className="chat-profile-msg">
                {chat_2nd_user && chat_2nd_user.img ? (
                  <img src={chat_2nd_user.img} />
                ) : (
                  <img src={userProfile} />
                )}
                <h3 style={{ marginLeft: "5px" }}>
                  {chat_2nd_user && chat_2nd_user.name}
                </h3>
              </div>
            )}
            {
              <div className="chat-all-msg-main" id="chat-all-msg">
                {chatUID ? (
                  allMessages.length > 0 &&
                  allMessages.map((msg, index) => {
                    return user.uid === msg.sentBy ? (
                      <div className="chat-su">
                        <div className="sender-user" key={msg.sentBy + index}>
                          {msg.message}
                        </div>
                      </div>
                    ) : (
                      <div className="chat-ru">
                        <div className="receiver-user" key={user.uid + index}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="chat-heading">
                    <p>Scegli dal menù l’utente per chattare</p>
                  </div>
                )}
              </div>
            }
            {chatUID && (
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
                          // e.target.blur();
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
