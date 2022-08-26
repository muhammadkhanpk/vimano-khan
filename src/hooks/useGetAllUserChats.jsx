import React, { useEffect, useState } from "react";
import { async } from "@firebase/util";
import { get, ref, onValue } from "firebase/database";
import { database } from "../firebase";
// function useGetAllUserChats(id) {
//   const [userChats, setUserChats] = useState([]);
//   useEffect(() => {
//     const getUserChats = () => {
//       get(ref(database, "userChats/" + id))
//         .then((snap) => {
//           if (snap.exists) {
//             setUserChats(Object.values(snap.val()));
//           } else {
//             //alert("data is not found");
//           }
//         })
//         .catch((err) => console.log(err));
//     };
//     getUserChats();
//   }, [id]);
//   return userChats;
// }

// export default useGetAllUserChats;
function useGetAllUserChats(id) {
  const [userChats, setUserChats] = useState([]);
  useEffect(() => {
    const getUserChats = () => {
      onValue(ref(database, "userChats/" + id), (snap) => {
        if (snap.exists()) {
          setUserChats(Object.values(snap.val()));
        }
      });
    };
    getUserChats();
  }, [id]);
  return userChats;
}

export default useGetAllUserChats;
