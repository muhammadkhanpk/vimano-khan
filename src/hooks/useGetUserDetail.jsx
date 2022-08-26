import { get, onValue, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import { database } from "../firebase";
function useGetUserDetail(ID) {
  const [user, setUser] = useState({});
  //console.log("user " + JSON.stringify(user));
  useEffect(() => {
    const getUser = () => {
      onValue(ref(database, "AllUsers/" + ID + "/user"), (snap) => {
        if (snap.exists()) {
          setUser(snap.val());
        }
      });
    };
    if (user != undefined) getUser();
  }, [ID]);
  return user;
}

export default useGetUserDetail;
