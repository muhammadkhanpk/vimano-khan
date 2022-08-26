import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import "./modal.css";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { BsCheckLg } from "react-icons/bs";

const SuccessModel = ({ open, setOpen, message }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className="success_modal_div">
        <div className="success_modal_circle_s_div">
          <span className="s_icon">
            <BsCheckLg />
          </span>
        </div>
        <div className="success_modal_content_div">
          <DialogTitle id="alert-dialog-title">
            <h3>Grazie!</h3>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Il tuo vino è ora condiviso!</p>
            </DialogContentText>
          </DialogContent>
        </div>

        <DialogActions>
          <Button onClick={handleClose}>Chiudi</Button>
          <Button onClick={handleClose} autoFocus>
            Torna all’elenco
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};
export default SuccessModel;
