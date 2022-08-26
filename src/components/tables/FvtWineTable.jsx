import React, { useState } from "react";
import "./wineTable.css";
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

function FvtWineTable({ data, itemsPerPage, currentPage, searchName, b, y }) {
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
  //console.log("search name is ::::" + searchName);
  // let f = data.slice(
  //   ...(searchName ? [0, 8] : [pageVisited, pageVisited + itemsPerPage])
  // );
  // console.log("function f", f.length);
  return (
    <>
      <div className="table-container-wine">
        {/* <div className="table-sorting-heading">
          {wineFavorite && wineFavorite.length > 0 ? (
            <h4>Fresh Recommendations </h4>
          ) : (
            <h3>You have no favorite wine</h3>
          )}
        </div> */}
        {data &&
          data
            .slice(pageVisited, pageVisited + itemsPerPage)
            .map((value, index) => {
              //console.log(value.postID);
              if (
                wineFavorite.length > 0 &&
                wineFavorite.some((v) => v.postID === value.postID)
              )
                return (
                  <div
                    className="wine-card"
                    style={{ width: "98%" }}
                    key={value.postID}
                    onClick={() =>
                      user.uid
                        ? navigate("/user/ad-detail/", {
                            state: { ad: value },
                          })
                        : alert("You Must login")
                    }
                  >
                    <div className="wine-img">
                      <img src={value.imagesUrl[0]} />
                      {value.imagesUrl.length > 1 ? (
                        <div className="imgs-count">
                          <AiOutlineCamera className="icons" />
                          {value.imagesUrl.length}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    <div className="wine-description-container">
                      <div className="row-name">
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

                        <div className="icon-style-x">
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
                        </div>
                      </div>
                      <div className="row-description">
                        <p className="poppins-desc">
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
                      <div className="row-location">
                        {/* <p style={{ fontSize: "12px", color: "black" }}>
                        {value.locationName} - {moment(value.date).fromNow()}
                      </p> */}
                        <p className="brandon-g-loc">
                          {value.locationName} - {moment(value.date).fromNow()}
                        </p>
                      </div>
                      <div className="row-price">
                        <b>
                          <h3 className="pri">{value.price}&euro;</h3>
                        </b>
                      </div>
                    </div>
                  </div>
                );
            })}
      </div>
    </>
  );
}

export default FvtWineTable;
