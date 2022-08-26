import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PvtRoute({ children }) {
  const { user } = useSelector((state) => state.userReducer);
  return user && user.email ? children : <Navigate to="/" />;
}

export default PvtRoute;
