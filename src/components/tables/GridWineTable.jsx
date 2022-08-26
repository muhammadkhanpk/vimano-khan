import React, { useState, useEffect } from "react";
import "./gridwine.scss";
import wine2 from "../../assets/wine2.jpg";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillAppstore,
  AiOutlineCamera,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { database } from "../../firebase";
import { ref, push, update, child, get, remove } from "firebase/database";
import useGetFavoriteUserWine from "../../hooks/useGetFavoriteUserWine";
import moment from "moment";

function GridWineTable({ data, itemsPerPage, currentPage, search, setSearch }) {
  //console.log(searchName);
  const { user } = useSelector((state) => state.userReducer);
  const wineFavorite = useGetFavoriteUserWine(user.uid);
  //console.log("favorite", JSON.stringify(wineFavorite));
  const navigate = useNavigate();

  const pageVisited = (currentPage - 1) * itemsPerPage;
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageVisited]);
  return (
    <div className="main-container">
      <div className="container">
        <div className="grid-container">
          {data &&
            data
              .slice(pageVisited, pageVisited + itemsPerPage)
              .map((value, index) => {
                return (
                  value.isActive && (
                    <div
                      className="grid-card"
                      key={value.postID}
                      onClick={() =>
                        user.uid
                          ? navigate("/user/ad-detail/", {
                              state: { ad: value },
                            })
                          : alert("You Must login")
                      }
                    >
                      <div className="imgs">
                        <img src={value.imagesUrl[0]} />
                      </div>
                      <div className="names">
                        <div>
                          <h3 style={{ color: "#800040", fontSize: "17px" }}>
                            {value.name}&nbsp;
                            {value.manufacturingYear ? (
                              <span className="sp-n">
                                ({value.manufacturingYear})
                              </span>
                            ) : (
                              <span className="sp-nn"></span>
                            )}
                          </h3>
                          <p className="wisky-brand">{value.brand}</p>
                        </div>
                      </div>
                      <div className="description">
                        <p>
                          {" "}
                          {value.description.length > 100
                            ? Array.from(Array(100), (e, i) => {
                                return <span>{value.description[i]}</span>;
                              })
                            : value.description}
                          {value.description.length > 100 ? (
                            <>
                              <span>...</span>
                              <span className="show-more">[Show More]</span>
                            </>
                          ) : (
                            <></>
                          )}
                        </p>
                      </div>
                      <div className="price-heart">
                        <h3 style={{ color: "#800040" }}>
                          {value.price}&euro;
                        </h3>
                        <p>
                          <>
                            {wineFavorite.length > 0 &&
                            wineFavorite.some(
                              (v) => v.postID === value.postID
                            ) ? (
                              <AiFillHeart
                                className="icon-style"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  savedHeart(value.postID, e);
                                }}
                              />
                            ) : (
                              <AiOutlineHeart
                                className="icon-style"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  savedHeart(value.postID, e);
                                }}
                              />
                            )}
                          </>
                        </p>
                      </div>
                      <div className="loc-time">
                        <p>
                          {value.locationName} - {moment(value.date).fromNow()}
                        </p>
                      </div>
                    </div>
                  )
                );
              })}
        </div>
      </div>
    </div>
  );
}
export default GridWineTable;
