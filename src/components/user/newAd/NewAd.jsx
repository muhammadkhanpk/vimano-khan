import {
  Autocomplete,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { push, ref as refDatabase, set } from "firebase/database";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { date } from "yup/lib/locale";
import { database, storage } from "../../../firebase";
import BottomBar from "../../bottombar/BottomBar";
import UserTopbar from "../../topbar/UserTopbar";
import "./newAd.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import useGetUserDetail from "../../../hooks/useGetUserDetail";
import SuccessModel from "../../models/SuccessModel";
import CustomSuccessModal from "../../models/CustomSuccessModal";
import CustomErrorModal from "../../models/CustomErrorModal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

///formik
import { useFormik } from "formik";
import * as Yup from "yup";
function NewAd() {
  const { user } = useSelector((state) => state.userReducer);
  const dbUser = useGetUserDetail(user.uid);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [modal, setModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [isFormOK, setIsFormOK] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const openModal = () => {
    setModal(true);
    document.body.style.overflowY = "hidden";
  };
  const openErrorModal = () => {
    setErrorModal(true);
    document.body.style.overflowY = "hidden";
  };
  const [manufacturingYear, setManufacturingYear] = useState("2022");
  // const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [btnClicked, setBtnClicked] = useState(true);
  //console.log(location);
  //here is map functionality
  const [location, setLocation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [autoPlaces, setAutoPlaces] = useState(null);
  const [libraries] = useState(["places"]);
  const [ad, setAd] = useState({});
  const initialValues = {
    name: "",
    wineType: "",
    price: "",
    description: "",
    locationName: "",
    manufacturingYear: "",
    brand: "",
    images: "",
  };
  const validationSchema = Yup.object({
    wineType: Yup.string().required("Campo richiesto"),
    name: Yup.string().required("Campo richiesto"),
    price: Yup.string().required("Campo richiesto"),
    description: Yup.string().required("Campo richiesto"),

    locationName: Yup.string().required("Campo richiesto"),

    // manufacturingYear: Yup.string().required("Required field!"),

    brand: Yup.string().required("Campo richiesto"),

    images: Yup.mixed().required("Campo richiesto"),
  });
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

  const onSubmit = async (event) => {
    // event.preventDefault()
    var links = [];
    setBtnClicked(false);

    for (let i = 0; i < images.length; i++) {
      const storageRef = refStorage(
        storage,
        "images/" + images[i].name + Date.now()
      );
      const uploadTask = uploadBytesResumable(storageRef, images[i]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(
            "Upload of image " + (i + 1) + " " + progress + " % done"
          );
        },
        (err) => {
          console.log(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            links.push(url);
            if (images.length === links.length) {
              const dbRef = refDatabase(database, "AllWines/");
              const newPostRef = push(dbRef);
              set(newPostRef, {
                postID: newPostRef.key,
                UID: user.uid,
                name: formik.values.name,
                wineType: formik.values.wineType,
                price: formik.values.price,
                description: formik.values.description,
                manufacturingYear: formik.values.manufacturingYear,
                brand: formik.values.brand,
                locationName,
                location,
                imagesUrl: links,
                date: Date.now(),
                isActive: true,
              })
                .then(() => {
                  const ad = {
                    postID: newPostRef.key,
                    UID: user.uid,
                    name: formik.values.name,
                    wineType: formik.values.wineType,
                    price: formik.values.price,
                    description: formik.values.description,
                    manufacturingYear: formik.values.manufacturingYear,
                    brand: formik.values.brand,
                    locationName,
                    location,
                    imagesUrl: links,
                    date: Date.now(),
                    isActive: true,
                  };
                  setAd(ad);
                  // setLocationName("");
                  // formik.resetForm();
                  setIsFormOK(true);
                  setMessage("Your Ad Posted Successfull!");
                  openModal();
                  setBtnClicked(true);
                  // setImages([]);
                })
                .catch(() => {
                  openErrorModal();
                  setBtnClicked(true);
                });
            }
          });
        }
      );
    }
    //  else {
    //   // alert("please fill the required fields");
    //   setBtnClicked(true);
    //   // handleClickOpen();
    //   // openModal();
    // }
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  useEffect(() => {
    if (
      dbUser &&
      dbUser.locationName &&
      dbUser !== undefined &&
      dbUser.location !== ""
    ) {
      setLocationName(dbUser.locationName);
      setLocation(dbUser.location);
      formik.setFieldValue("locationName", dbUser.locationName);
    }
    window.scrollTo(0, 0);
  }, [dbUser]);
  const years = (back) => {
    const year = new Date().getFullYear();
    const yearsss = Array.from({ length: back }, (v, i) => year - back + i + 1);
    return yearsss.sort((a, b) => b - a);
  };
  const wineAge = years(50);

  return (
    <div>
      <UserTopbar />
      <BottomBar />
      <SuccessModel open={open} setOpen={setOpen} message={message} />
      {modal && <CustomSuccessModal setModal={setModal} ad={ad} />}
      {errorModal && <CustomErrorModal setModal={setErrorModal} />}

      <div className="app-container">
        <form id="data-form" onSubmit={formik.handleSubmit}>
          <div className="new-ad">
            <h3 style={{ textAlign: "center" }}>
              Metti in vendita la tua bottiglia in 3 semplici passi!
            </h3>
            {/* <p>Its free and takes less than a minute.</p> */}

            <div className="card">
              <div
                className="card-imgs"
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                }}
              >
                <b className="img-infox">Carica fino a 8 foto</b>
                <label
                  className={images.length > 0 ? "images" : "images-x"}
                  for="file-uploads"
                >
                  {images.length > 0 ? (
                    /* <p>Immagini selezionate {images.length}</p> */
                    <p style={{ fontSize: "14px" }}>Cerca tra le immagini</p>
                  ) : (
                    <p style={{ fontSize: "14px" }}>Cerca tra le immagini</p>
                  )}
                </label>
                <input
                  type="file"
                  id="file-uploads"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  name="images"
                  onChange={(e) => {
                    if (e.target.files.length > 8) {
                      alert("you are selecting more than 8 images");
                    } else {
                      let dumyArray = [...images, ...e.target.files];
                      if (dumyArray.length < 9) {
                        setImages((prev) => [...prev, ...e.target.files]);
                        formik.setFieldValue("images", e.target.files);
                      } else {
                        alert("You are selecting more than 8 images");
                      }
                    }
                  }}
                />
                {formik.touched.images && formik.errors.images ? (
                  <div className="error_div">{formik.errors.images}</div>
                ) : null}

                <div className="images_main_div">
                  <div className="images_main_div">
                    {images.length > 0 &&
                      images.map((file, i) => {
                        return (
                          <div key={i} className="images_div">
                            <div className="img_upload_div">
                              <img
                                src={URL.createObjectURL(file)}
                                className=" image_div"
                                onClick={() => {
                                  window.open(URL.createObjectURL(file));
                                }}
                              />
                            </div>
                            <label className="p_img_">
                              <div>
                                <input
                                  type="file"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    let arr = images;
                                    arr[i] = e.target.files[0];
                                    setImages([...arr]);
                                  }}
                                  accept="image/*"
                                  style={{ display: "none" }}
                                />
                              </div>
                              <div className="img_actions">
                                <span className="select_">Modifica</span>
                                <span>
                                  <button
                                    className="btn_remove"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (images.length === 1) {
                                        alert("Richiesta almeno un’immagine");
                                      } else {
                                        if (
                                          window.confirm(
                                            "Are u sure to remove?"
                                          )
                                        ) {
                                          let arr = images;
                                          arr.splice(i, 1);
                                          setImages([...arr]);
                                        }
                                      }
                                    }}
                                  >
                                    Rimuovi
                                  </button>
                                </span>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              {/* <hr style={{ marginTop: "5px" }} /> */}
              <div className="wine-info">
                <b>
                  <p className="img-infox">Informazioni sulla bottiglia</p>
                </b>

                <div className="desc">
                  <p>Tipo di vino</p>
                  <div className="desc_input_div">
                    <div>
                      <FormControl className="mui_select" size="small">
                        {!formik.values.wineType && (
                          <InputLabel id="demo-select-small" size="small">
                            <span style={{ fontSize: "13px" }}>
                              Tipo di vino
                            </span>
                          </InputLabel>
                        )}
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          name="name"
                          value={formik.values.wineType}
                          label={formik.values.wineType ? "" : "Tipo di Vino"}
                          onChange={(e) => {
                            formik.setFieldValue("wineType", e.target.value);
                          }}
                        >
                          <MenuItem value={"Rosso"}>{"Rosso"}</MenuItem>
                          <MenuItem value={"Bianco"}>{"Bianco"}</MenuItem>
                          <MenuItem value={"Bolla"}>{"Bolla"}</MenuItem>
                          <MenuItem value={"Rosè"}>{"Rosè"}</MenuItem>

                          <MenuItem value={"Dolce"}>{"Dolce"}</MenuItem>
                          <MenuItem value={"Altro"}>{"Altro"}</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    {formik.touched.wineType && formik.errors.wineType ? (
                      <div className="error_div">{formik.errors.wineType}</div>
                    ) : null}
                  </div>
                </div>
                <div className="desc">
                  <p>Vino</p>
                  <div className="desc_input_div">
                    <div>
                      <input
                        type="text"
                        className="inputs"
                        placeholder="Vino"
                        name="name"
                        value={formik.values.name}
                        onChange={(e) => {
                          formik.setFieldValue("name", e.target.value);
                        }}
                      />
                    </div>
                    {formik.touched.name && formik.errors.name ? (
                      <div className="error_div">{formik.errors.name}</div>
                    ) : null}
                  </div>
                </div>
                <div className="desc">
                  <p>Annata</p>

                  <div className="desc_input_div">
                    <div>
                      <FormControl className="mui_select" size="small">
                        <InputLabel id="demo-select-small" size="small">
                          <span
                            style={{ fontSize: "13px" }}
                            className={
                              formik.values.manufacturingYear ? "annata" : ""
                            }
                          >
                            Annata
                          </span>
                        </InputLabel>

                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          name="name"
                          value={formik.values.manufacturingYear}
                          label={
                            formik.values.manufacturingYear ? "" : "Annata"
                          }
                          onChange={(e) => {
                            formik.setFieldValue(
                              "manufacturingYear",
                              e.target.value
                            );
                          }}
                        >
                          {wineAge.map((v, i) => {
                            return (
                              <MenuItem key={i} value={v}>
                                {v}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          className="inputs"
                          views={["year"]}
                          name={"manufacturingYear"}
                          value={formik.values.manufacturingYear}
                          onChange={(newValue) => {
                            formik.setFieldValue(
                              "manufacturingYear",
                              new Date(newValue).getFullYear() + ""
                            );
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider> */}
                    </div>
                    {formik.touched.manufacturingYear &&
                    formik.errors.manufacturingYear ? (
                      <div className="error_div">
                        {formik.errors.manufacturingYear}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="desc">
                  <p>Cantina</p>

                  <div className="desc_input_div">
                    <div>
                      <input
                        type="text"
                        className="inputs"
                        placeholder="Cantina"
                        name="brand"
                        value={formik.values.brand}
                        onChange={(e) => {
                          formik.setFieldValue("brand", e.target.value);
                        }}
                      />
                    </div>
                    {formik.touched.brand && formik.errors.brand ? (
                      <div className="error_div">{formik.errors.brand}</div>
                    ) : null}
                  </div>
                </div>
              </div>
              {/* <hr style={{ marginTop: "10px" }} /> */}

              <div className="more-info">
                <b>
                  <p className="img-infox">Altre informazioni</p>
                </b>

                <div className="desc">
                  <p>Descrizione e condizioni di vendita</p>
                  <div className="desc_input_div">
                    <div>
                      <textarea
                        cols="21"
                        rows="5"
                        style={{
                          fontFamily: "Arial, Helvetica, sans-serif",
                          fontSize: "13px",
                        }}
                        className="inputs"
                        placeholder="Descrizione e condizioni di vendita"
                        name="description"
                        value={formik.values.description}
                        onChange={(e) => {
                          formik.setFieldValue("description", e.target.value);
                        }}
                      ></textarea>
                    </div>
                    {formik.touched.description && formik.errors.description ? (
                      <div className="error_div">
                        {formik.errors.description}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="desc">
                  <p>Dove si trova la bottiglia</p>

                  <div className="desc_input_div">
                    <div>
                      {isLoaded ? (
                        <Autocomplete
                          onLoad={(val) => setAutoPlaces(val)}
                          onPlaceChanged={placeChanged}
                        >
                          <input
                            type="text"
                            className="input-location inputs"
                            placeholder=" Dove si trova la bottiglia"
                            name="locationName"
                            // value={formik.values.locationName}
                            value={locationName}
                            onChange={(e) => {
                              setLocationName(e.target.value);
                              formik.setFieldValue(
                                "locationName",
                                e.target.value
                              );
                            }}
                          />
                        </Autocomplete>
                      ) : (
                        <span>Map is loading..</span>
                      )}
                    </div>
                    {formik.touched.locationName &&
                    formik.errors.locationName ? (
                      <div className="error_div">
                        {formik.errors.locationName}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="desc">
                  <p>Prezzo di vendita</p>
                  <div className="desc_input_div">
                    <div>
                      <input
                        type="number"
                        className="inputs"
                        placeholder="&euro;"
                        min="1"
                        onInput={(e) => {
                          if (e.target.value.length > 4) {
                            e.target.value = e.target.value.slice(0, 4);
                          }
                        }}
                        name="price"
                        value={formik.values.price}
                        onChange={(e) => {
                          formik.setFieldValue("price", e.target.value);
                        }}
                      />
                    </div>
                    {formik.touched.price && formik.errors.price ? (
                      <div className="error_div">{formik.errors.price}</div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="btn-post">
                {!isFormOK ? (
                  <button
                    type="submit"
                    title="Post Your Add"
                    className="btnPostAd"
                    disabled={!btnClicked}
                  >
                    Inserisci Vino
                  </button>
                ) : (
                  <button className="isFormOK" onClick={() => navigate("/")}>
                    Torna all’elenco
                  </button>
                )}
              </div>
              {/* <hr style={{ marginTop: "5px" }} /> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewAd;
