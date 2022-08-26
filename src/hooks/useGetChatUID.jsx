import React, { useState, useEffect } from "react";
import { get, ref, push, child } from "firebase/database";
import { database } from "../firebase";
function useGetChatUID(userid, nextuserid) {
  //console.log("current user " + userid + " and next user id " + nextuserid);
  const [chatID, setChatID] = useState("");
  useEffect(() => {
    const getUID = () => {
      get(ref(database, "chats")).then((snap) => {
        if (snap.exists()) {
          const chatuids = Object.values(snap.val());
          //console.log("abc", chatuids);
          const f = chatuids.filter((chat, index) => {
            if (chat.members[0] === userid && chat.members[1] === nextuserid) {
              return chat;
            } else if (
              chat.members[1] === userid &&
              chat.members[0] === nextuserid
            ) {
              return chat;
            }
          });
          //console.log("value of f" + JSON.stringify(f));
          if (f !== undefined && f.length !== 0) {
            setChatID(f[0].chatUID);
            //console.log("OLD ID IS GETED " + JSON.stringify(chatID));
          } else {
            setChatID(push(child(ref(database), "chats")).key);
            //console.log("new id is generate " + JSON.stringify(chatID));
          }
        } else {
          setChatID(push(child(ref(database), "chats")).key);
        }
      });
    };
    if (nextuserid !== undefined && nextuserid !== "" && nextuserid != false)
      getUID();
  }, [nextuserid, userid]);
  return chatID;
}

export default useGetChatUID;
