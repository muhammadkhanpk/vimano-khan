import React, { useEffect, useState ,useMemo} from "react";
// import { async } from "@firebase/util";
import { get, ref, onValue, onChildChanged, onChildAdded,query,orderByChild, equalTo } from "firebase/database";
import { database } from "../firebase";
import useGetAllUserChats from "./useGetAllUserChats";
import { useSelector } from "react-redux";

function useGetAllUnReadMsgsByUID(UID) {
  const { user, updateUser } = useSelector((state) => state.userReducer);
  const allChatsUIDS = useGetAllUserChats(UID);

 
 let uniqueMsgs = [];
  const [msgs, setMsgs] = useState([]);
  const getMsgs = async () => {
    const isAlert = JSON.parse(sessionStorage.getItem('isAlret'));
    let arr = msgs;
    arr.splice(0, arr.length);
    setMsgs([...arr]);
    allChatsUIDS.map(async (chatuid) => {
      let q = ref(database, "chatMessages/" + chatuid.chatUID);
     
       onValue(
         q,
          (snap) => {
            if (snap.exists()) {
              const unReadMsgs = Object.values(snap.val()).filter(
                (msg) => !msg.msgRead && msg.sentBy !== user.uid
              );
    

              // if (unReadMsgs.length > 0) {
              //   if (isAlert !== null && !isAlert) {
              //     sessionStorage.setItem('isAlret', JSON.stringify(true));
              //   }
              // }
              setMsgs((prve) => [...prve, ...unReadMsgs]);
            }
          }
        );
      })

  };
   const key = "msgTime";
   uniqueMsgs = [...new Map(msgs.map((item) => [item[key], item])).values()];

  useEffect(async() => {
    await getMsgs()

  }, [UID, allChatsUIDS,updateUser]);



  return uniqueMsgs;
  // return [...new Set(msgs.map((item) => item.msgTime))];
}

export default useGetAllUnReadMsgsByUID;
