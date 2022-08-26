import React, { useEffect, useState } from "react";
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
// console.log("data it italian ", moment().format("dddd DD/MM").fromNow());
function WineTable({ data, itemsPerPage, currentPage, search, setSearch }) {
  //console.log("windesssss", itemsPerPage);
  //console.log(searchName);
  const { user } = useSelector((state) => state.userReducer);
  const wineFavorite = useGetFavoriteUserWine(user.uid);
  //console.log("favorite", JSON.stringify(wineFavorite));
  const navigate = useNavigate();
  const [len, setLen] = useState(100);
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
      alert("Devi essere loggato per poter procedere");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageVisited]);
  return (
    <>
      <div className="table-container-wine">
        {/* <div className="table-sorting-heading">
          {search ? (
            <h4 style={{ color: "red" }}>
              {data.length} results are found.
              <button
                className="btn-clear"
                onClick={() => {
                  user.email ? navigate("/") : setSearch("");
                }}
              >
                Reset
              </button>
            </h4>
          ) : (
            <h4>Fresh Recommendations</h4>
          )}
          <AiFillAppstore className="icon-style" />
        </div> */}
        {data &&
          data
            .slice(pageVisited, pageVisited + itemsPerPage)
            .map((value, index) => {
              return (
                value.isActive && (
                  <div
                    className="wine-card"
                    key={value.postID + index}
                    onClick={() =>
                      user.uid
                        ? navigate("/user/ad-detail/", {
                            state: { ad: value },
                          })
                        : alert("Devi essere loggato per poter procedere")
                    }
                  >
                    <div className="wine-img">
                      <img className="wine_image" src={value.imagesUrl[0]} />
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
                )
              );
            })}
      </div>
    </>
  );
}

export default WineTable;

// import React, { useState } from "react";
// import "./wineTable.css";
// import wine2 from "../../assets/wine2.jpg";
// import {
//   AiFillHeart,
//   AiOutlineHeart,
//   AiFillAppstore,
//   AiOutlineCamera,
// } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { database } from "../../firebase";
// import { ref, push, update, child, get, remove } from "firebase/database";
// import useGetFavoriteUserWine from "../../hooks/useGetFavoriteUserWine";
// import moment from "moment";

// function WineTable({ data, itemsPerPage, currentPage, search }) {
//   //console.log(searchName);
//   const { user } = useSelector((state) => state.userReducer);
//   const wineFavorite = useGetFavoriteUserWine(user.uid);
//   //console.log("favorite", JSON.stringify(wineFavorite));
//   const navigate = useNavigate();

//   const pageVisited = (currentPage - 1) * itemsPerPage;
//   const savedHeart = async (id, e) => {
//     if (user.uid) {
//       get(ref(database, "AllUsers/" + user.uid + "/favorite/" + id)).then(
//         (snapshot) => {
//           if (snapshot.exists()) {
//             if (window.confirm("Are you sure to Remove from favorite")) {
//               remove(
//                 child(
//                   ref(database),
//                   "/AllUsers/" + user.uid + "/favorite/" + id
//                 )
//               ).then(() => {
//                 //e.target.style.fill = "grey";
//               });
//             }
//           } else {
//             const updates = {};
//             updates["/AllUsers/" + user.uid + "/favorite/" + id] = {
//               postID: id,
//             };
//             update(ref(database), updates).then(() => {
//               // e.target.style.fill = "red";
//             });
//           }
//         }
//       );
//     } else {
//       alert("You must login");
//     }
//   };
//   return (
//     <>
//       <div className="table-container-wine">
//         <div className="table-sorting-heading">
//           {search ? (
//             <h4 style={{ color: "red" }}>{data.length} results are found.</h4>
//           ) : (
//             <h4>Fresh Recommendations</h4>
//           )}
//           {/* <AiFillAppstore className="icon-style" /> */}
//         </div>
//         {data &&
//           data
//             .slice(pageVisited, pageVisited + itemsPerPage)
//             .map((value, index) => {
//               return (
//                 <div
//                   className="wine-card"
//                   key={value.postID}
//                   onClick={() =>
//                     user.uid
//                       ? navigate("/user/ad-detail/", {
//                           state: { ad: value },
//                         })
//                       : alert("You Must login")
//                   }
//                 >
//                   <div className="wine-img">
//                     <img src={value.imagesUrl[0]} />
//                     {value.imagesUrl.length > 1 ? (
//                       <div className="imgs-count">
//                         <AiOutlineCamera className="icons" />
//                         {value.imagesUrl.length}
//                       </div>
//                     ) : (
//                       <div></div>
//                     )}
//                   </div>

//                   <div className="wine-description-container">
//                     <div className="row-name">
//                       <h3>{value.name}</h3>
//                       <>
//                         {wineFavorite.length > 0 &&
//                         wineFavorite.some((v) => v.postID === value.postID) ? (
//                           <AiFillHeart
//                             className="icon-style"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               savedHeart(value.postID, e);
//                             }}
//                           />
//                         ) : (
//                           <AiOutlineHeart
//                             className="icon-style"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               savedHeart(value.postID, e);
//                             }}
//                           />
//                         )}
//                       </>
//                     </div>
//                     <div className="row-description">
//                       <p>{value.description}</p>
//                     </div>
//                     <div className="row-location">
//                       <p style={{ fontSize: "12px", color: "black" }}>
//                         {value.locationName} - {moment(value.date).fromNow()}
//                       </p>
//                       <b>
//                         <h3 className="pri">{value.price}&euro;</h3>
//                       </b>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//       </div>
//     </>
//   );
// }

// export default WineTable;
