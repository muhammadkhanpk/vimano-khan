import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { auth } from "../../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
export default function ForgetPasswordModal({ open, setOpen }) {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        let msg =
          "An email reset password link has been sent to " +
          email +
          "\n Check yor gmail inbox or spam to reset the password and signin!";
        alert(msg);
      })
      .catch((e) => {
        alert(e.code);
      });
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Resest Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For resest password please enter your email!
          </DialogContentText>
          <form name="forget-passsword_form" onSubmit={onSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              required
              fullWidth
              variant="standard"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
