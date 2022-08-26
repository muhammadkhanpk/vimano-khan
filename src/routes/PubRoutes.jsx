import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SignIn from "../components/auth/signin/SignIn";
import Home from "../screens/home/Home";
function PubRoute(children) {
  const { user } = useSelector((state) => state.userReducer);

  return user && user.email ? <Navigate to="/user" /> : <Home />;
}

export default PubRoute;
