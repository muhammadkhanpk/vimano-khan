import React, { useState } from "react";
import "./signIn.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import amico from "../../../assets/amico.png";
import logo_vimano from "../../../assets/logo_vimano.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  userRequest,
  userSuccess,
  userFailure,
} from "../../../Redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import ForgetPasswordModal from "./ForgetPasswordModal";
// firebase
import { auth, database } from "../../../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
} from "firebase/auth";
import { get, ref, set, child, update } from "firebase/database";
function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const provider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

  const { loading, error } = useSelector((state) => state.userReducer);
  const [showPassword, setShowPassword] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("E-mail obbligatoria"),
    password: Yup.string().required("Password obbligatoria").min(8),
  });

  const onSubmit = async () => {
    if (formik.values.email && formik.values.password) {
      dispatch(userRequest());
      await signInWithEmailAndPassword(
        auth,
        formik.values.email,
        formik.values.password
      )
        .then(async (userCredential) => {
          const user = userCredential.user;
          // console.log("user is", user);
          if (user) {
            if (user.emailVerified) {
              await update(
                child(ref(database), "AllUsers/" + user.uid + "/user"),
                {
                  emailVerified: user.emailVerified,
                }
              );
              dispatch(userSuccess(user));
              navigate("/user");
            } else {
              auth.signOut().then(() => {
                dispatch(
                  userFailure(
                    "Your Email is not verified Check your Inbox or Spam folder"
                  )
                );
              });
            }

            // if (user) {
            //   get(ref(database, "AllUsers/" + user.uid + "/user")).then(
            //     (snap) => {
            //       if (snap.exists()) {
            //         dispatch(userSuccess(snap.val()));
            //         navigate("/user");
            //       }
            //     }
            //   );
          } else {
            auth.signOut().then(() => {
              dispatch(userFailure("You are not an admin"));
            });
          }
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

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        if (user) {
          //const { confirmPassword, otherValues } = formik.values;
          // console.log("user ", user);
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
  const signInWithFacebook = () => {
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
      <ForgetPasswordModal open={open} setOpen={setOpen} />
      <div className="shape_box">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo_vimano} />
        </div>
        <div className="title-heading">
          <p style={{ paddingLeft: "20px" }}>
            Benvenuto in Vimano, la piattaforma per lo scambio del buon vino a
            portata di mano!
          </p>
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
          <h1
            style={{
              margin: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Benvenuto!
          </h1>
          <div className="login-with-social">
            <div className="signupwithgoogle" onClick={signInWithGoogle}>
              <FcGoogle className="google-icon" />
              <button>Google Login</button>
            </div>
            <div className="signupwithgoogle x" onClick={signInWithFacebook}>
              <FaFacebookF className="google-icon fb" />
              <button>Facebook Login</button>
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
              type="email"
              placeholder="E-mail"
              id="email"
              name="email"
              className="input-field"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div id="error">{formik.errors.email}</div>
            ) : null}
            <div className="icon-password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                name="password"
                className="input-field"
                {...formik.getFieldProps("password")}
              />
              <div
                className="icon-eye-fill"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <AiFillEye className="icons-eye" />
                ) : (
                  <AiFillEyeInvisible className="icons-eye" />
                )}
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div id="error">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="forget_password_div">
              <span className="forget_password_span">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleClickOpen();
                  }}
                >
                  Password dimenticata?
                </a>
              </span>
            </div>
            <input
              type="submit"
              value={loading ? "Loading...." : "Login"}
              className="btn-signIn"
              disabled={loading}
            ></input>
          </form>
          <p className="p-signIn">
            Non hai ancora un account?
            <span className="register-link">
              <NavLink to="/signup">Registrati</NavLink>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
