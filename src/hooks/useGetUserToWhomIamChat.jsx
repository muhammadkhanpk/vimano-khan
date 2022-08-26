import { get, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import { database } from "../firebase";
function useGetUserToWhomIamChat(uid, chatUID) {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = () => {
      get(ref(database, "userChats/" + uid + "/" + chatUID)).then((snap) => {
        if (snap.exists()) {
          setUser(snap.val().user);
        }
      });
    };
    if (chatUID !== undefined && uid !== undefined) getUser();
  }, [chatUID, uid]);
  return user;
}

export default useGetUserToWhomIamChat;
