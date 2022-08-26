import { async } from "@firebase/util";
import { get, ref, onValue } from "firebase/database";
import React, { useState, useEffect } from "react";
import { database } from "../firebase";
function useGetFavoriteUserWine(ID) {
  const [favorite, setFavorite] = useState([]);
  useEffect(() => {
    const getFavorite = async () => {
      // await get(ref(database, "AllUsers/" + ID + "/favorite"))
      //   .then((snapshot) => {
      //     if (snapshot.exists()) {
      //       setFavorite(Object.values(snapshot.val()));
      //     } else {
      //     }
      //   })
      onValue(ref(database, "AllUsers/" + ID + "/favorite"), (snap) => {
        if (snap.exists()) {
          //console.log(Object.values(snap.val()));
          setFavorite(Object.values(snap.val()));
        } else {
          setFavorite([]);
        }
      });
    };
    getFavorite();
  }, [ID]);
  return favorite;
}

export default useGetFavoriteUserWine;
