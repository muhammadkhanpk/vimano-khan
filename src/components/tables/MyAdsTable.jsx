import React from "react";
import "./myAdsTable.scss";
import wine2 from "../../assets/wine2.jpg";
import { ref, child, remove, update } from "firebase/database";
import { database } from "../../firebase";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { RiRadioButtonLine } from "react-icons/ri";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
function MyAdsTable({ data, itemsPerPage, currentPage, searchName }) {
  const { user } = useSelector((state) => state.userReducer);
  const pageVisited = (currentPage - 1) * itemsPerPage;
  const removeAd = (e, id) => {
    e.stopPropagation();

    if (
      window.confirm("Sei sicuro di eliminare definitivamente questo annuncio?")
    ) {
      remove(child(ref(database), "/AllWines/" + id)).then(() => {
        alert("Deleted successfully");
      });
    }
  };
  const activeDeactive = (id, flag) => {
    if (window.confirm("Sei sicuro di cambiare lo stato dell’annuncio?")) {
      update(child(ref(database), "AllWines/" + id), {
        isActive: flag,
      });
    }
  };
  const navigate = useNavigate();
  const getItalianDate = (date) => {
    return new Date(date).toLocaleDateString("it-IT", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <>
      <div className="container-x">
        {data &&
          data
            .slice(pageVisited, pageVisited + itemsPerPage)
            .map((value, index) => {
              return (
                <div
                  className="ads"
                  key={value.PostID}
                  onClick={(e) => {
                    navigate("/user/edit-ad/" + value.postID, {
                      state: value,
                    });
                  }}
                >
                  <div className="name-row">
                    <h3>
                      {value.name}
                      {value.manufacturingYear ? (
                        <span className="sp-n">
                          &nbsp;({value.manufacturingYear})
                        </span>
                      ) : (
                        <span className="sp-nn"></span>
                      )}
                    </h3>
                    <p className="wisky-brand">{value.brand}</p>
                  </div>
                  <div className="info-row">
                    <div className="img-info">
                      {!value.imagesUrl ? (
                        <img src={wine2} />
                      ) : (
                        <img src={value.imagesUrl[0]} />
                      )}
                    </div>
                    <div className="desc">
                      {/* <div className="brand">
                        <h3>{value.brand}</h3>
                      </div> */}
                      <div className="date">
                        <p> Creato il {getItalianDate(value.date)}</p>
                      </div>
                      <div className="actions">
                        <p>
                          <FormControlLabel
                            onClick={(e) => e.stopPropagation()}
                            control={
                              <Switch
                                checked={value.isActive === true ? true : false}
                                onChange={(e) => {
                                  activeDeactive(
                                    value.postID,
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label={value.isActive ? "Attivo" : "Inattivo"}
                          />
                        </p>

                        <button
                          className=""
                          onClick={(e) => removeAd(e, value.postID)}
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}

export default MyAdsTable;

// import React from "react";
// import "./myAdsTable.css";
// import wine2 from "../../assets/wine2.jpg";
// import { ref, child, remove, update } from "firebase/database";
// import { database } from "../../firebase";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";
// import { RiRadioButtonLine } from "react-icons/ri";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";
// function MyAdsTable({ data, itemsPerPage, currentPage, searchName }) {
//   const { user } = useSelector((state) => state.userReducer);
//   const pageVisited = (currentPage - 1) * itemsPerPage;
//   const removeAd = (e, id) => {
//     e.stopPropagation();

//     if (window.confirm("Are you sure to Remove from favorite")) {
//       remove(child(ref(database), "/AllWines/" + id)).then(() => {
//         alert("Deleted successfully");
//       });
//     }
//   };
//   const activeDeactive = (id, flag) => {
//     if (window.confirm("Are you sure !")) {
//       update(child(ref(database), "AllWines/" + id), {
//         isActive: flag,
//       });
//     }
//   };
//   const navigate = useNavigate();
//   const getItalianDate = (date) => {
//     return new Date(date).toLocaleDateString("it-IT", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };
//   return (
//     <>
//       <div className="table-container">
//         {data &&
//           data
//             .filter((val) => {
//               if (searchName == "") {
//                 return val;
//               } else if (
//                 val.name.toLowerCase().includes(searchName.toLowerCase())
//               ) {
//                 return val;
//               }
//             })
//             .slice(
//               ...(searchName
//                 ? [0, data.length]
//                 : [pageVisited, pageVisited + itemsPerPage])
//             )
//             .map((value, index) => {
//               return (
//                 <div className="table-container2" key={value.postID}>
//                   <div
//                     className="ads-card"
//                     onClick={(e) => {
//                       navigate("/user/edit-ad/" + value.postID, {
//                         state: value,
//                       });
//                     }}
//                   >
//                     {/* <div className="date">
//                       <p>From {moment(value.date).format("DD MMM YY")}</p>
//                     </div> */}
//                     <div className="desc">
//                       {!value.imagesUrl ? (
//                         <img className="ad_img" src={wine2} />
//                       ) : (
//                         <img
//                           className="ad_img"
//                           src={value.imagesUrl[0]}
//                           // onClick={(e) => {
//                           //   e.stopPropagation();
//                           //   window.open(value.imagesUrl[0]);
//                           // }}
//                         />
//                       )}
//                       <p
//                         style={{
//                           color: "#800040",
//                           marginLeft: "2px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {value.name}
//                         {value.manufacturingYear ? (
//                           <span className="sp-n">
//                             ({value.manufacturingYear})
//                             <span className="sp-nxx">-</span>
//                             <span className="sp-nx">{value.brand}</span>
//                           </span>
//                         ) : (
//                           <span className="sp-nn">-{value.brand}</span>
//                         )}
//                       </p>

//                       <p style={{ color: "#800040", marginLeft: "5px" }}>
//                         {value.price}&euro;
//                       </p>
//                     </div>
//                     <div className="date_div">
//                       <span className="date_span">
//                         {getItalianDate(value.date)}
//                       </span>
//                     </div>
//                     <div className="actions">
//                       {/* <p
//                         style={{
//                           color: `${value.isActive ? "green" : "gray"}`,
//                         }}
//                       >
//                         <RiRadioButtonLine />
//                         {value.isActive ? `Active` : `DeActive`}
//                       </p> */}
//                       <span className="action_span">
//                         <FormControlLabel
//                           onClick={(e) => e.stopPropagation()}
//                           control={
//                             <Switch
//                               checked={value.isActive === true ? true : false}
//                               onChange={(e) => {
//                                 activeDeactive(value.postID, e.target.checked);
//                               }}
//                             />
//                           }
//                           label={value.isActive ? "Attivo" : "Inattivo"}
//                         />
//                       </span>
//                       {/* <button
//                         className="btn"
//                         onClick={() =>
//                           activeDeactive(value.postID, value.isActive)
//                         }
//                       >
//                         {value.isActive ? "Active" : "Deactive"}
//                       </button> */}
//                       {/* <span className="action_span">
//                         <button
//                           className="btn"
//                           onClick={() => {
//                             navigate("/user/edit-ad/" + value.postID, {
//                               state: value,
//                             });
//                           }}
//                         >
//                           Edit
//                         </button>
//                       </span> */}

//                       <span className="action_span">
//                         <button
//                           className="btn"
//                           onClick={(e) => removeAd(e, value.postID)}
//                         >
//                           Elimina
//                         </button>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//       </div>
//     </>
//   );
// }

// export default MyAdsTable;
