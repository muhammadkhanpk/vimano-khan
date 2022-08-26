import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter } from "react-router-dom";
import Chat from "./components/user/chat/Chat";
import AdDetail from "./components/user/adDetail/AdDetail";
import AdsList from "./components/user/ads/AdsList";
import moment from "moment";
import "./fonts/brandon/Brandon_reg.otf";
moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s fa",
    s: "pochi secondi",
    ss: "%ss sec",
    m: "1 min",
    mm: "%d min",
    h: "1 hr",
    hh: "%d hr",
    d: "1 giorno",
    dd: "%d giorno",
    M: "1 mese",
    MM: "%d mese",
    y: "1 anno",
    yy: "%d anno",
  },
});
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,

  document.getElementById("root")
);
