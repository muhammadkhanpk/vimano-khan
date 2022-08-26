import { async } from "@firebase/util";
import { get, onValue, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import { database } from "../firebase";
function useGetAllWines(ID) {
  const [wines, setWines] = useState([]);
  useEffect(() => {
    const getWines = async () => {
      onValue(ref(database, "AllWines"), (snapshot) => {
        if (snapshot.exists()) {
          setWines(
            Object.values(snapshot.val()).sort((a, b) => b.date - a.date)
          );
        } else {
          //alert("Data is not found..");
        }
      });
    };
    getWines();
  }, [ID]);
  return wines;
}

export default useGetAllWines;
