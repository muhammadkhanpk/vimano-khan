import {
  Autocomplete,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { ref, update, child, remove } from "firebase/database";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, database, storage } from "../../../firebase";
import useGetUserDetail from "../../../hooks/useGetUserDetail";
import { userFailure } from "../../../Redux/Actions/userActions";
import CustomBottomBar from "../../bottombar/CustomBottomBar";
import BottomBar from "../../bottombar/BottomBar";
import UserTopbar from "../../topbar/UserTopbar";
import Geocode from "react-geocode";
import userProfile from "../../../assets/userProfile.png";
import "./editProfile.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import SimpleLoading from "../../Loading/Loader";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useGetAllUserChats from "../../../hooks/useGetAllUserChats";
import {
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import useGetUserWine from "../../../hooks/useGetUserWine";
function EditProfile() {
  var lat, lng;
  const { user } = useSelector((s) => s.userReducer);
  const userwines = useGetUserWine(user.uid);
  const userallchatsuids = useGetAllUserChats(user.uid);
  //console.log("all wines ", userwines);
  const userInfo = useGetUserDetail(user.uid);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const [name, setName] = useState("");
  //const [about, setAbout] = useState("");
  const [cell, setCell] = useState("");
  const [img, setImg] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [currentPosition, setCurrentPosition] = useState({});
  const [locationName, setLocationName] = useState("");
  const [showPhone, setShowPhone] = useState("");
  // console.log("current user is ", auth.currentUser);
  // console.log("positon", currentPosition);
  useEffect(() => {
    setName(userInfo.name);
    //setAbout(userInfo.about ? userInfo.about : "");
    setCell(userInfo.cell);
    setLocationName(userInfo.locationName);
    setShowPhone(userInfo.showPhone && userInfo.showPhone);
    setLocation(userInfo.location);
    setImg(
      userInfo.img !== undefined && userInfo.img !== ""
        ? userInfo.img
        : userProfile
    );
    //getLocation();
  }, [userInfo]);

  const [autoPlaces, setAutoPlaces] = useState(null);
  const [libraries] = useState(["places"]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDYUVOVS2fuO6dIFZLk0TA3SL1PEIikwUw",
    libraries,
  });
  const placeChanged = () => {
    if (autoPlaces != null) {
      const response = autoPlaces.getPlace();
      let city, state, country, myLocName;
      for (let i = 0; i < response.address_components.length; i++) {
        for (let j = 0; j < response.address_components[i].types.length; j++) {
          switch (response.address_components[i].types[j]) {
            case "locality":
              city = response.address_components[i].long_name;
              break;
            case "administrative_area_level_1":
              state = response.address_components[i].long_name;
              break;
            case "country":
              country = response.address_components[i].long_name;
              break;
          }
        }
      }
      if (city !== undefined && country !== undefined) {
        myLocName = city + " " + country;
      } else {
        myLocName =
          city !== undefined
            ? city
            : state !== undefined
            ? state
            : country !== undefined
            ? country
            : "No Location";
      }
      setLocationName(myLocName);
      setLocation(response.geometry.location.toJSON());
    } else {
      // console.log("auto complete is not loaded yet");
    }
  };
  const saveChanges = () => {
    if (
      name !== "" &&
      cell !== "" &&
      name !== undefined &&
      cell !== undefined &&
      locationName !== "" &&
      locationName !== undefined
    ) {
      setLoading(true);
      const updates = {};

      updates["/AllUsers/" + user.uid + "/user/"] = {
        ...userInfo,
        name,
        // about,
        img,
        cell,
        location,
        locationName,
      };
      update(ref(database), updates).then(() => {
        setLoading(false);
        alert("Profilo aggiornato");
      });
    } else {
      alert("Alcuni campi sono vuoti");
    }
  };

  const uploadImg = (img) => {
    if (img !== undefined && img !== null) {
      let d = Date.now();
      setImgLoading(true);
      const storageDb = refStorage(storage, "profiles/" + d + img.name);
      const uploadTask = uploadBytesResumable(storageDb, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          alert(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //console.log("url is", url);
            setImg(url);
            setImgLoading(false);

            // const updates = {};
            // updates["/AllUsers/" + user.uid + "/user/img"] = url;
            // update(ref(database), updates).then(() => {
            //   // alert("Profile Pic is updated");
            // });
          });
        }
      );
    } else {
      alert("Please select image");
    }
  };
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  function showPosition(position) {
    // setCurrentPosition({
    //   lat: position.coords.latitude,
    //   lng: position.coords.longitude,
    // });
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      {
        latLng: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      },
      function (results, status) {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            //setLocationName(results[0].formatted_address);
            console.log(results[0].formatted_address);
          }
        }
      }
    );
  }

  const getCurrentLocation = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ latLng: currentPosition }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          setLocationName(results[0].formatted_address);
        }
      }
    });
  };
  const updatePhoneShow = () => {
    // setShowPhone(!showPhone);
    update(child(ref(database), "AllUsers/" + userInfo.UID + "/user"), {
      showPhone: !showPhone,
    });
  };
  const deleteAccount = async (uid) => {
    if (
      window.confirm(
        "Sei sicuro di volere eliminare definitivamente il tuo account e relativi dati?"
      )
    ) {
      fetchSignInMethodsForEmail(auth, user.email).then((result) => {
        if (result[0] === "google.com") {
          signInWithPopup(auth, googleProvider).then((result) => {
            const user = result.user;
            if (user.email) {
              //DELETED ALL WINES HERE....
              userwines.length > 0 &&
                userwines.forEach((wine) => {
                  remove(child(ref(database), "/AllWines/" + wine.postID)).then(
                    () => {}
                  );
                });
              // REMOVE USER HERE.....
              remove(child(ref(database), "AllUsers/" + uid)).then(() => {});
              //REMOVE USER CHAT MESSAGES...
              userallchatsuids.length > 0 &&
                userallchatsuids.forEach((CHATUID) => {
                  remove(
                    child(ref(database), "chatMessages/" + CHATUID.chatUID)
                  ).then(() => {});
                });
              //REMOVE USER CHATS UID
              remove(child(ref(database), "userChats/" + uid)).then(() => {});
              // deleted user auth
              auth.currentUser
                .delete()
                .then(() => {
                  alert(
                    "Il tuo profilo è stato eliminato con successo. Speriamo di vederti nuovamente con noi. Buon vino!"
                  );
                })
                .catch((err) => {
                  console.log(JSON.stringify(err));
                });
            }
          });
        } else if (result[0] === "facebook.com") {
          signInWithPopup(auth, fbProvider)
            .then((result) => {
              const user = result.user;
              if (user.email) {
                //DELETED ALL WINES HERE....
                userwines.length > 0 &&
                  userwines.forEach((wine) => {
                    remove(
                      child(ref(database), "/AllWines/" + wine.postID)
                    ).then(() => {});
                  });
                // REMOVE USER HERE.....
                remove(child(ref(database), "AllUsers/" + uid)).then(() => {});
                //REMOVE USER CHAT MESSAGES...
                userallchatsuids.length > 0 &&
                  userallchatsuids.forEach((CHATUID) => {
                    remove(
                      child(ref(database), "chatMessages/" + CHATUID.chatUID)
                    ).then(() => {});
                  });
                //REMOVE USER CHATS UID
                remove(child(ref(database), "userChats/" + uid)).then(() => {});
                // deleted user auth
                auth.currentUser
                  .delete()
                  .then(() => {
                    alert(
                      "Il tuo profilo è stato eliminato con successo. Speriamo di vederti nuovamente con noi. Buon vino!"
                    );
                  })
                  .catch((err) => {
                    console.log(JSON.stringify(err));
                  });
              }
            })
            .catch((err) => {
              console.log("error occured is ", err);
            });
        }
      });
    }

    //alert(submit());
    // if (window.confirm("Are you sure to Delete your Account?")) {
    // remove(child(ref(database), "/AllWines/" + id)).then(() => {
    //   alert("Deleted successfully");
    // });
    // await remove(child(ref(database), "AllUsers/" + uid)).then(() => {
    //   alert("user is deleted");
    // });
    // await remove(child(ref(database), "userChats/" + uid)).then(() => {
    //   alert("chat is deleted");
    // });
    // await auth.currentUser
    //   .delete()
    //   .then(() => {
    //     alert("auth is deleted");
    //   })
    //   .catch((err) => {
    //     console.log(JSON.stringify(err));
    //   });
    //alert("under process");
    // }
  };
  return (
    <div>
      <UserTopbar />
      {/* <BottomBar /> */}
      {/* <CustomBottomBar /> */}
      <div className="app-container">
        {loading ? <SimpleLoading /> : ""}
        <div className="edit-profile-container">
          <div className="card">
            <div className="delete-account">
              <p className="heading">Profilo Utente</p>
              <hr className="hr" />
            </div>
            <div className="card-profile">
              <div className="col-left">
                {/* <p className="heading2">Basic Information</p> */}
                <input
                  type="text"
                  className="field2"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {/* <textarea
                  cols="10"
                  rows="4"
                  className="field2"
                  placeholder="About"
                  value={about}
                  style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
                  onChange={(e) => setAbout(e.target.value)}
                ></textarea> */}
              </div>
              <div className="col-right">
                <div className="abc">
                  <img
                    src={img}
                    className="userImg"
                    onClick={() => {
                      window.open(img);
                    }}
                  />
                  {imgLoading ? <SimpleLoading /> : ""}
                  {/* {userInfo.img ? (
                    <img src={userInfo.img} className="userImg" />
                  ) : (
                    <img src={userProfile} className="userImg" />
                  )} */}
                </div>
                <div className="p-img">
                  <label>
                    <span className="lb">Scegli foto</span>
                    <input
                      type="file"
                      onChange={(e) => {
                        uploadImg(e.target.files[0]);
                        // setImg(e.target.files[0]);
                      }}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </label>
                  {/* <input
                    type="button"
                    value="Save"
                    className="btn"
                    onClick={uploadImg}
                  /> */}
                </div>
              </div>
            </div>

            {/* <hr className="hr" /> */}
            <div className="phone-show">
              {/* <button onClick={() => updatePhoneShow()}>
                {showPhone ? "Show" : "Hide"}
              </button> */}
              <p>
                <FormControlLabel
                  onClick={(e) => e.stopPropagation()}
                  control={
                    <Switch
                      checked={showPhone === true ? true : false}
                      onChange={(e) => {
                        updatePhoneShow();
                      }}
                    />
                  }
                  label={
                    showPhone
                      ? "Numero di telefono VISIBILE su Vimano"
                      : "Numero di telefono NASCOSTO su Vimano"
                  }
                />
              </p>
              {/* <span>
                Your Phone# is {showPhone ? "Showing" : "Hidden"} to visitors.
              </span> */}
            </div>

            <div className=" contact-detail-main">
              <div className="contact-detail">
                {/* <input
                type="tel"
                className="field"
                placeholder="+92 300 1234567"
                value={cell}
                onChange={(e) => setCell(e.target.value)}
              /> */}
                <PhoneInput
                  className="field"
                  international
                  defaultCountry="IT"
                  placeholder="Enter phone number"
                  value={cell}
                  onChange={setCell}
                />
                <span>Numero di telefono per contattarti (se visibile)</span>
              </div>
              <div className="contact-detail">
                <input
                  type="text"
                  value={userInfo.email ? userInfo.email : "vimano@gmail.com"}
                  className="field"
                  placeholder="vimano@gmail.com"
                  disabled
                />
                <span>La tua e-mail non viene mai condivisa</span>
              </div>
              <div className="contact-detail">
                {isLoaded ? (
                  <Autocomplete
                    onLoad={(val) => setAutoPlaces(val)}
                    onPlaceChanged={placeChanged}
                    className="auto_complete"
                  >
                    <input
                      type="text"
                      className="field"
                      value={locationName}
                      placeholder="Città dove si trovano i vini"
                      onChange={(e) => setLocationName(e.target.value)}
                    />
                  </Autocomplete>
                ) : (
                  <span>Map is loading..</span>
                )}
              </div>
              <div className="contact-detail">
                <p
                  onClick={() => deleteAccount(user.uid)}
                  className="delete-account"
                >
                  Elimina Account
                </p>
              </div>
            </div>

            <div className="card-bottom">
              <p className="discard" onClick={() => navigate("/user")}>
                Annulla
              </p>
              <p className="save-changes" onClick={saveChanges}>
                Salva
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;

// import {
//   Autocomplete,
//   GoogleMap,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import { ref, update } from "firebase/database";
// import {
//   getDownloadURL,
//   ref as refStorage,
//   uploadBytesResumable,
// } from "firebase/storage";
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { database, storage } from "../../../firebase";
// import useGetUserDetail from "../../../hooks/useGetUserDetail";
// import { userFailure } from "../../../Redux/Actions/userActions";
// import CustomBottomBar from "../../bottombar/CustomBottomBar";
// import UserTopbar from "../../topbar/UserTopbar";
// import Geocode from "react-geocode";

// import "./editProfile.css";

// function EditProfile() {
//   var lat, lng;
//   const { user } = useSelector((s) => s.userReducer);
//   const userInfo = useGetUserDetail(user.uid);
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [about, setAbout] = useState("");
//   const [cell, setCell] = useState("");
//   const [img, setImg] = useState();
//   const [location, setLocation] = useState("");
//   const [locationName, setLocationName] = useState("");

//   useEffect(() => {
//     setName(userInfo.name);
//     setEmail(userInfo.email);
//     setAbout(userInfo.about);
//     setCell(userInfo.cell);
//     setLocation(userInfo.location);
//     setLocationName(userInfo.locationName);
//     setImg(userInfo.img);
//   }, [userInfo]);

//   const [autoPlaces, setAutoPlaces] = useState(null);
//   const [libraries] = useState(["places"]);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyDYUVOVS2fuO6dIFZLk0TA3SL1PEIikwUw",
//     libraries,
//   });
//   const placeChanged = () => {
//     if (autoPlaces != null) {
//       const places = autoPlaces.getPlace();
//       // console.log("name is cc ", places.name);
//       // console.log("name is ", places.formatted_address);
//       setLocationName(places.formatted_address);
//       setLocation(places.geometry.location.toJSON());
//     } else {
//       // console.log("auto complete is not loaded yet");
//     }
//   };
//   const saveChanges = () => {
//     if (
//       name !== "" &&
//       email !== "" &&
//       about !== "" &&
//       cell !== "" &&
//       img != null &&
//       locationName != ""
//     ) {
//       if (!userInfo.img) {
//         const storageDb = refStorage(storage, "/profile/images", img.name);
//         const uploadTask = uploadBytesResumable(storageDb, img);
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {},
//           (err) => {
//             alert(err);
//           },
//           () => {
//             getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//               console.log(url);
//               const updates = {};

//               updates["/AllUsers/" + user.uid + "/user/"] = {
//                 ...userInfo,
//                 name,
//                 email,
//                 about,
//                 cell,
//                 img: url,
//                 location,
//                 locationName,
//               };
//               update(ref(database), updates).then(() => {
//                 alert("Profile is updated");
//               });
//             });
//           }
//         );
//       } else {
//         alert("else part is runing");
//         const updates = {};

//         updates["/AllUsers/" + user.uid + "/user/"] = {
//           ...userInfo,
//           name,
//           email,
//           about,
//           cell,
//           location,
//           locationName,
//         };
//         update(ref(database), updates).then(() => {
//           alert("Profile is updated");
//         });
//       }
//     } else {
//       alert("there is an empty field");
//     }
//   };
//   function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(function showPosition(position) {
//         Geocode.fromLatLng(
//           position.coords.latitude,
//           position.coords.longitude
//         ).then(
//           (response) => {
//             const address = response.results[0].formatted_address;
//             let city, state, country;
//             for (
//               let i = 0;
//               i < response.results[0].address_components.length;
//               i++
//             ) {
//               for (
//                 let j = 0;
//                 j < response.results[0].address_components[i].types.length;
//                 j++
//               ) {
//                 switch (response.results[0].address_components[i].types[j]) {
//                   case "locality":
//                     city = response.results[0].address_components[i].long_name;
//                     break;
//                   case "administrative_area_level_1":
//                     state = response.results[0].address_components[i].long_name;
//                     break;
//                   case "country":
//                     country =
//                       response.results[0].address_components[i].long_name;
//                     break;
//                 }
//               }
//             }
//             console.log(city, state, country);
//             //console.log(address);
//           },
//           (error) => {
//             console.error(error);
//           }
//         );
//       });
//     } else {
//     }
//   }

//   Geocode.setApiKey("AIzaSyDYUVOVS2fuO6dIFZLk0TA3SL1PEIikwUw");

//   Geocode.setLanguage("en");
//   return (
//     <div>
//       <UserTopbar />
//       <CustomBottomBar />
//       <div className="app-container">
//         <div className="edit-profile-container">
//           <div className="card">
//             <p className="heading">Edit Profile</p>
//             <hr className="hr" />
//             <div className="card-profile">
//               <div className="col-left">
//                 <p className="heading2">Basic Information</p>
//                 <input
//                   type="text"
//                   className="field2"
//                   placeholder="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <textarea
//                   cols="10"
//                   rows="4"
//                   className="field2"
//                   placeholder="About"
//                   value={about}
//                   onChange={(e) => setAbout(e.target.value)}
//                 ></textarea>
//               </div>
//               <div className="col-right">
//                 <div className="abc">
//                   {userInfo.img ? (
//                     <img src={userInfo.img} className="userImg" />
//                   ) : (
//                     <>
//                       <label className="images" for="file-uploads">
//                         {img ? (
//                           <img
//                             src={window.URL.createObjectURL(img)}
//                             className="userImg"
//                           />
//                         ) : (
//                           <p>Browse Images to uploads</p>
//                         )}
//                       </label>
//                       <input
//                         type="file"
//                         id="file-uploads"
//                         onChange={(e) => {
//                           setImg(e.target.files[0]);
//                         }}
//                         accept="image/*"
//                         style={{ display: "none" }}
//                       />
//                     </>
//                   )}
//                 </div>
//                 <div>
//                   <input type="button" value="upload" />
//                   <input type="button" value="upload" />
//                 </div>
//               </div>
//             </div>

//             <hr className="hr" />
//             <div className="contact-detail">
//               <input
//                 type="text"
//                 className="field"
//                 placeholder="+92 300 1234567"
//                 value={cell}
//                 onChange={(e) => setCell(e.target.value)}
//               />
//               <span>This is the number for buyers contact.</span>
//             </div>
//             <div className="contact-detail">
//               <input
//                 type="text"
//                 value={email}
//                 className="field"
//                 placeholder="vimano@gmail.com"
//                 disabled
//               />
//               <span>We would not reveal your email to anyone else.</span>
//             </div>
//             <div className="contact-detail">
//               {isLoaded ? (
//                 <Autocomplete
//                   onLoad={(val) => setAutoPlaces(val)}
//                   onPlaceChanged={placeChanged}
//                 >
//                   <input
//                     type="text"
//                     className="field22"
//                     value={locationName}
//                     placeholder="location"
//                     onChange={(e) => setLocation(e.target.value)}
//                   />
//                 </Autocomplete>
//               ) : (
//                 <span>Map is loading..</span>
//               )}
//             </div>
//             <div className="card-bottom">
//               <p className="discard" onClick={() => navigate("/user")}>
//                 Discard
//               </p>
//               <p className="save-changes" onClick={saveChanges}>
//                 Save Changes
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditProfile;
