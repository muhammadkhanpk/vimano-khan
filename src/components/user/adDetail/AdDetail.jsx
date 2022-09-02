import React from "react";
import UserTopbar from "../../topbar/UserTopbar";
import BottomBar from "../../bottombar/BottomBar";
import "./adDetail.css";
import amico from "../../../assets/amico.png";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsFillChatSquareTextFill, BsPhone, BsTelephone } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import Map from "../../map/Map";
import useGetUserDetail from "../../../hooks/useGetUserDetail";
import { database } from "../../../firebase";
import { ref, get, update, remove, child } from "firebase/database";
import useGetFavoriteUserWine from "../../../hooks/useGetFavoriteUserWine";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";

function AdDetail() {
  document.body.style.overflowY = "visible";
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showCell, setShowCell] = useState(true);
  // const [alertCount, setAlertCount] = useState(1);
  // if (state && state.flag && alertCount === 1) {
  //   alert("Wine has been inserted.");
  //   setAlertCount(2);
  // }
  const ad = state && state.ad !== "undefined" ? state.ad : {};
  const adUser = useGetUserDetail(ad.UID);
  const wineFavorite = useGetFavoriteUserWine(user.uid);
  const savedHeart = async (id, e) => {
    if (user.uid) {
      get(ref(database, "AllUsers/" + user.uid + "/favorite/" + id)).then(
        (snapshot) => {
          if (snapshot.exists()) {
            if (
              window.confirm(
                "Sei sicuro di rimuovere questo annuncio dai tuoi vini preferiti?"
              )
            ) {
              remove(
                child(
                  ref(database),
                  "/AllUsers/" + user.uid + "/favorite/" + id
                )
              ).then(() => {
                //e.target.style.fill = "grey";
              });
            }
          } else {
            const updates = {};
            updates["/AllUsers/" + user.uid + "/favorite/" + id] = {
              postID: id,
            };
            update(ref(database), updates).then(() => {
              // e.target.style.fill = "red";
            });
          }
        }
      );
    } else {
      alert("You must login");
    }
  };
  const chatThread = () => {
    if (ad.UID === user.uid) {
      alert("Non puoi chattare con te stesso!");
    } else {
      navigate("/user/chat-with-seller", {
        state: {
          adUser,
        },
      });
    }
  };
  const getCell = (cellNo) => {
    if (cellNo.length > 3) {
      let cell = "";
      for (let i = 0; i < cellNo.length; i++) {
        if (i < 4) {
          cell = cell + cellNo[i];
        } else {
          cell = cell + "-";
        }
      }
      return cell;
    } else {
      return cellNo;
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <UserTopbar />
      <BottomBar />
      <div className="app-container">
        <div className="ad-heading">
          {/* <p className="brandon-g-h1">{ad.name}</p> */}
        </div>
        <div className="ad-detail">
          <div className="ad-img">
            <div className="img-card">
              <div className="imgs-carousel">
                <Carousel showThumbs={false} autoPlay={true} showStatus={false}>
                  {ad &&
                    ad.imagesUrl.map((pic, index) => (
                      <div key={index + ad.postID}>
                        <img src={pic} alt="Parent" className="carousel-img" />
                      </div>
                    ))}
                </Carousel>
              </div>
            </div>
            <div className="img-detail">
              <p
                className="brandon-g-h1"
                style={{ color: "#800040", fontSize: "17px" }}
              >
                {ad.name}&nbsp;
                {ad.manufacturingYear ? (
                  <span style={{ marginLeft: "1px" }}>
                    ({ad.manufacturingYear})
                  </span>
                ) : (
                  <span style={{ marginLeft: "1px" }}></span>
                )}
              </p>
              <p className="wisky-brand">{ad.brand}</p>

              {/* <h4 style={{ marginTop: "15px" }} className="brandon-g-h4">
                Description
              </h4> */}
              <p className="poppins-desc">{ad.description}</p>
            </div>
          </div>

          <div className="ad-menus">
            <div className="price-card">
              <div className="price-row">
                <div>
                  <h3 style={{ color: "#800040", fontSize: "17px" }}>
                    {ad.name}&nbsp;
                    {ad.manufacturingYear ? (
                      <span className="sp-n">({ad.manufacturingYear})</span>
                    ) : (
                      <span className="sp-nn"></span>
                    )}
                  </h3>
                  <p className="wisky-brand">{ad.brand}</p>
                </div>

                <div>
                  {wineFavorite.length > 0 &&
                  wineFavorite.some((v) => v.postID === ad.postID) ? (
                    <AiFillHeart
                      className="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        savedHeart(ad.postID, e);
                      }}
                    />
                  ) : (
                    <AiOutlineHeart
                      className="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        savedHeart(ad.postID, e);
                      }}
                    />
                  )}
                </div>
              </div>
              <div style={{ paddingLeft: "7px" }}>
                <h3 style={{ color: "#800040" }}>{ad.price}&euro;</h3>
              </div>
              <p style={{ paddingLeft: "7px" }} className="poppins-desc">
                {ad.locationName} - {moment(ad.date).fromNow()}
              </p>
            </div>
            <div className="profile-card">
              {/* <h3 style={{ padding: "10px" }} className="brandon-g-h3">
                Seller Description
              </h3> */}
              <div className="profile-row">
                {!adUser.img ? <img src={amico} /> : <img src={adUser.img} />}
                &nbsp;&nbsp;
                <h3>{adUser && adUser.name}</h3>
              </div>
              <button
                onClick={() => chatThread()}
                style={{ cursor: "pointer" }}
              >
                <BsFillChatSquareTextFill className="icon-style" />
                <span className="brandon-g-h3 chat_span">
                  Chat col venditore
                </span>
              </button>

              {adUser.cell ? (
                adUser.showPhone ? (
                  <a
                    href={`tel:${adUser && adUser.cell}`}
                    className="cell_phone_x"
                  >
                    <BsTelephone className="icon-style" />
                    <span>{adUser && adUser.cell}</span>
                  </a>
                ) : (
                  <button>
                    <BsTelephone className="icon-style" />
                    <span className="chat_span">
                      Numero nascosto dal venditore
                    </span>
                  </button>
                )
              ) : (
                <button>
                  <BsTelephone className="icon-style" />
                  <span className="chat_span">There is no Cell#</span>
                </button>
              )}

              {/* <div className="row-cell">
                <BsTelephone className="icon-style" />
                {adUser.cell ? (
                  !showCell ? (
                    <p>{adUser.cell}</p>
                  ) : (
                    <p>{getCell(adUser.cell)}</p>
                  )
                ) : (
                  <p>There is no cell# </p>
                )}
                {adUser.cell && showCell ? (
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowCell(!showCell)}
                  >
                    Show
                  </p>
                ) : (
                  adUser.cell && (
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowCell(!showCell)}
                    >
                      Hide
                    </p>
                  )
                )}
              </div> */}
            </div>
            <div className="map-card">
              <div className="posted-in">
                <p style={{ fontWeight: "bold", fontSize: "12px" }}>
                  Questo vino si trova a:&nbsp;
                </p>
                <p className="" style={{ fontSize: "13px" }}>
                  {ad.locationName}
                </p>
              </div>
              <div className="map">
                <Map location={ad.location} locationName={ad.locationName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdDetail;
