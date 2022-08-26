import React, { useState } from "react";
import "./signUp.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import amico from "../../../assets/amico.png";
import logo_vimano from "../../../assets/logo_vimano.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { auth, database } from "../../../firebase";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import {
  userFailure,
  userRequest,
  userSuccess,
} from "../../../Redux/Actions/userActions";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const provider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

  const { loading, error } = useSelector((state) => state.userReducer);

  //console.log("loading is", loading);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    // username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Nome obbligatorio"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email obbligatoria"),
    // username: Yup.string().required("Username is required").min(8),
    password: Yup.string().required("Password obbligatoria").min(8),
    confirmPassword: Yup.string()
      .required("Conferma Password obbligatoria")
      .oneOf([Yup.ref("password"), null], "Password must match"),
  });

  const onSubmit = async () => {
    if (
      formik.values.name &&
      formik.values.email &&
      formik.values.password
      // &&formik.values.username
    ) {
      dispatch(userRequest());
      await createUserWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(async (userCredential) => {
          const user = userCredential.user;
          sendEmailVerification(user)
            .then(() => {
              let msg =
                "An email verification link has been sent to " +
                user.email +
                "\n Check yor gmail inbox or spam to verify email and signin!";

              if (user) {
                //const { confirmPassword, otherValues } = formik.values;

                set(ref(database, "AllUsers/" + user.uid + "/user/"), {
                  name: formik.values.name,
                  email: formik.values.email,
                  UID: user.uid,
                  emailVerified: user.emailVerified,
                })
                  .then(() => {
                    auth.signOut().then(() => {
                      dispatch(userSuccess({}));
                      alert(msg);
                      navigate("/signin");
                    });
                  })
                  .catch((err) => {
                    dispatch(userFailure(err.code));
                  });
              } else {
                auth.signOut().then(() => {});
              }
            })
            .catch((e) => {
              dispatch(userFailure(e));
            });
        })
        .catch((err) => {
          dispatch(userFailure(err.code));
        });
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        if (user) {
          get(ref(database, "AllUsers/" + user.uid + "/user/")).then((snap) => {
            if (snap.exists()) {
              dispatch(userSuccess(user));
              navigate("/user");
            } else {
              //alert("not from saved user");
              set(ref(database, "AllUsers/" + user.uid + "/user/"), {
                name: user.displayName,
                email: user.email,
                UID: user.uid,
              })
                .then(() => {
                  dispatch(userSuccess(user));
                  navigate("/user");
                })
                .catch((err) => {
                  dispatch(userFailure(err.code));
                });
            }
          });
        } else {
          auth.signOut().then(() => {});
        }
      })
      .catch((error) => {
        // Handle Errors here.
        // console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const signUpWithFacebook = () => {
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        const user = result.user;
        //console.log("user data ", user);
        if (user) {
          get(ref(database, "AllUsers/" + user.uid + "/user/")).then((snap) => {
            if (snap.exists()) {
              dispatch(userSuccess(user));
              navigate("/user");
            } else {
              //alert("not from saved user");
              set(ref(database, "AllUsers/" + user.uid + "/user/"), {
                name: user.displayName,
                email: user.email,
                UID: user.uid,
              })
                .then(() => {
                  dispatch(userSuccess(user));
                  navigate("/user");
                })
                .catch((err) => {
                  dispatch(userFailure(err.code));
                });
            }
          });
        } else {
          auth.signOut().then(() => {});
        }
      })
      .catch((error) => {
        if (error.code == "auth/account-exists-with-different-credential") {
          const { fullName, localId, email } = error.customData._tokenResponse;
          const user = {
            uid: localId,
            displayName: fullName,
            email: email,
          };

          // console.log("userssssss ", user);
          get(ref(database, "AllUsers/" + user.uid + "/user/")).then((snap) => {
            if (snap.exists()) {
              dispatch(userSuccess(user));
              navigate("/user");
            } else {
              //alert("not from saved user");
              set(ref(database, "AllUsers/" + user.uid + "/user/"), {
                name: user.displayName,
                email: user.email,
                UID: user.uid,
              })
                .then(() => {
                  dispatch(userSuccess(user));
                  navigate("/user");
                })
                .catch((err) => {
                  dispatch(userFailure(err.code));
                });
            }
          });
        }
      });
  };
  return (
    <div className="signIn">
      <div className="shape_box">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo_vimano} />
        </div>
        <div className="title-heading">
          <p style={{ paddingLeft: "20px" }}>
            Cerca la bottiglia che ti manca! E’ semplice come bere un bicchiere…
            di vino!
          </p>
          {/* <p>Bottles here</p> */}
        </div>
        <div className="large-logo">
          <img src={amico} />
        </div>
      </div>
      <div className="shape_form">
        <div className="mobile-v-logo">
          <div className="mobile-logo">
            <img src={logo_vimano} />
          </div>
        </div>
        <div className="login-card">
          <h1 className="create-account">Crea Account</h1>
          <div className="login-with-social">
            <div className="signupwithgoogle" onClick={signUpWithGoogle}>
              <FcGoogle className="google-icon" />
              <button>Registrati con Google</button>
            </div>
            <div className="signupwithgoogle x" onClick={signUpWithFacebook}>
              <FaFacebookF className="google-icon fb" />
              <button>Registrati con Facebook</button>
            </div>
          </div>
          <p
            style={{
              margin: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            -oppure-
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="error">{error && error}</div>
            <input
              type="text"
              className="input-field"
              placeholder="Nome"
              name="name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name ? (
              <div id="error">{formik.errors.name}</div>
            ) : null}
            <input
              type="email"
              className="input-field"
              placeholder="E-mail"
              name="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div id="error">{formik.errors.email}</div>
            ) : null}

            {/* <input
              type="text"
              className="input-field"
              placeholder="Username"
              name="username"
              {...formik.getFieldProps("username")}
            />
            {formik.touched.username && formik.errors.username ? (
              <div id="error">{formik.errors.username}</div>
            ) : null} */}

            <div className="icon-password">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Password"
                name="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div id="error">{formik.errors.password}</div>
              ) : null}
              <div
                className="icon-eye-fill"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="icons-eye" />
                ) : (
                  <AiFillEye className="icons-eye" />
                )}
              </div>
            </div>
            <div className="icon-password">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input-field"
                placeholder="Conferma Password"
                name="confirmPassword"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div id="error">{formik.errors.confirmPassword}</div>
              ) : null}
              <div
                className="icon-eye-fill"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible className="icons-eye" />
                ) : (
                  <AiFillEye className="icons-eye" />
                )}
              </div>
            </div>
            <input
              type="submit"
              value="Registrati"
              className="btn-signIn"
            ></input>
          </form>
          <p className="p-signUp">
            Hai già un account?
            <span className="register-link">
              <NavLink to="/signin">Login</NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SignUp);
