import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "../components/auth/signin/SignIn";
import SignUp from "../components/auth/signup/SignUp";
import Home from "../screens/home/Home";
import User from "../screens/User/User";
import PubRoute from "./PubRoutes";
import PvtRoute from "./PvtRoutes";
import AdsList from "../components/user/ads/AdsList";
import AdDetail from "../components/user/adDetail/AdDetail";
import Chat from "../components/user/chat/Chat";
import NewAd from "../components/user/newAd/NewAd";
import EditAd from "../components/user/ads/editAd/editAd";
import EditProfile from "../components/user/profile/EditProfile";
import ChatWithSeller from "../components/user/chatwithseller/ChatWithSeller";
function AllRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <PubRoute>
              <Home />
            </PubRoute>
          }
        />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />

        <Route path="user">
          <Route
            index
            element={
              <PvtRoute>
                <User />
              </PvtRoute>
            }
          />
          <Route
            path="ads-list"
            element={
              <PvtRoute>
                <AdsList />
              </PvtRoute>
            }
          />
          <Route
            path="ad-detail"
            element={
              <PvtRoute>
                <AdDetail />
              </PvtRoute>
            }
          />
          <Route
            path="chat"
            element={
              <PvtRoute>
                <Chat />
              </PvtRoute>
            }
          />
          <Route
            path="chat-with-seller"
            element={
              <PvtRoute>
                <ChatWithSeller />
              </PvtRoute>
            }
          />
          <Route
            path="new-ad"
            element={
              <PvtRoute>
                <NewAd />
              </PvtRoute>
            }
          />
          <Route
            path="edit-ad/:id"
            element={
              <PvtRoute>
                <EditAd />
              </PvtRoute>
            }
          />
          <Route
            path="edit-profile"
            element={
              <PvtRoute>
                <EditProfile />
              </PvtRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AllRoutes;
