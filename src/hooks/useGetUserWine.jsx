import { async } from "@firebase/util";
import { get, onValue, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import { database } from "../firebase";
function useGetUserWine(ID) {
  const [wines, setWines] = useState([]);
  useEffect(() => {
    const getWines = async () => {
      await onValue(ref(database, "AllWines"), (snapshot) => {
        if (snapshot.exists()) {
          const w = Object.values(snapshot.val()).filter(
            (wine) => wine.UID === ID
          );
          setWines(w);
        } else {
          //alert("Data is not found..");
        }
      });
    };
    getWines();
  }, [ID]);
  return wines;
}

export default useGetUserWine;
