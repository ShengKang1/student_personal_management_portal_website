import React from "react";
import { auth, sendPasswordResetEmail } from "../firebase";
import Swal from "sweetalert2";

function ForgotPassword(props) {
  if (!props.open) return null;

  const resetpasswordBtn = () => {
    const email = document.getElementById("email").value.trim();
    Swal.fire({
      title: "Sending...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Reset Password link send",
          text: "Please check your email : " + email,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          Swal.close();
          props.onClose();
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error end link" + error,
          text: error.message + "Please try again.",
          allowOutsideClick: false,
        });
      });
  };

  return (
    <div>
      <div className="all_modal_background_design" onClick={props.onClose}>
        <div
          className="all_modal_content"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "1.3rem",
            }}
          >
            Enter your email address we will send you a link to reset your
            account password
            <input
              id="email"
              name="email"
              className="all_modal_input"
              type="text"
              placeholder="Email Address"
              style={{ marginTop: "30px" }}
              required
            ></input>
          </div>
          <div className="all_modal_button_position">
            <button
              onClick={resetpasswordBtn}
              className="all_modal_button_style create_modal_button"
            >
              Reset Password
            </button>
            <button
              onClick={props.onClose}
              className="all_modal_button_style close_modal_button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
