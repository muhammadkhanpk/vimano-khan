import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const FullPageLoading = () => {
  const loadingStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const overlayStyles = {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
  };
  return (
    <>
      <div style={overlayStyles}></div>
      <div style={loadingStyles}>
        <Loader type="ThreeDots" color="#0e2718" height={80} width={80} />
      </div>
    </>
  );
};

export default FullPageLoading;
