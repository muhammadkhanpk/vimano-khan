import React, { useEffect, useState } from "react";
import { async } from "@firebase/util";
import { get, ref, onValue } from "firebase/database";
import { database } from "../firebase";
function useGetAllMsgs(chatUID) {
  // alert(chatUID);
  const [msgs, setMsgs] = useState([]);
  useEffect(() => {
    const getMsgs = () => {
      if (chatUID !== "") {
        onValue(ref(database, "chatMessages/" + chatUID), (snap) => {
          if (snap.exists()) {
            //console.log(Object.values(snap.val()));
            setMsgs(Object.values(snap.val()));
          }
        });
      }
    };
    if (chatUID !== undefined && chatUID !== "") getMsgs();
  }, [chatUID]);
  return msgs;
}

export default useGetAllMsgs;
