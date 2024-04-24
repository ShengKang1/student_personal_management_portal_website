import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEGi_Background from "../assets/SEGi_Background.png";
import SEGi_Logo from "../assets/SEGi_Logo.png";
import "../css/Login.css";
import Swal from "sweetalert2";
import {
  signInWithEmailAndPassword,
  auth,
  firestore,
  getDocs,
  collection,
  query,
  where,
} from "../firebase";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ForgotPassword from "./ForgotPassword";

function Login() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const loginbtn = async () => {
    const personal_email = document
      .getElementById("personal_email")
      .value.trim();
    const password = document.getElementById("password").value.trim();

    Swal.fire({
      title: "Logging in...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    if (personal_email.trim() === "" || password.trim() === "") {
      // Input is empty
      Swal.fire({
        icon: "error",
        title: "Please fill in all fill",
        text: "Invalid credentials",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
      return;
    }

    const emailQuerySnapshot = await getDocs(
      query(
        collection(firestore, "admin"),
        where("personal_email", "==", personal_email)
      )
    );
    if (emailQuerySnapshot.empty) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The email is not belong for admin, please try again.",
        allowOutsideClick: false,
        showConfirmButton: "OK",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, personal_email, password);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login successfully",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        // Redirect to the main page after successful login
        sessionStorage.setItem("personal_email", personal_email);
        sessionStorage.setItem("password", password);
        navigate("/approveaccount");
      });
    } catch (error) {
      // Login failed
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
    }
  };

  const togglePassword = () => {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (passwordInput) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.innerHTML = '<i class="fa-regular fa fa-eye"></i>';
      } else {
        passwordInput.type = "password";
        togglePassword.innerHTML = '<i class="fa-regular fa fa-eye-slash"></i>';
      }
    }
  };

  const forgotpassword = () => {
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${SEGi_Background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        // backgroundPosition: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="login_content">
          <div className="login_content_change">
            <div className="login_content_left">
              <img
                style={{ width: "200px" }}
                src={SEGi_Logo}
                alt="Description of the image"
              ></img>
              <div
                style={{
                  width: "350px",
                  fontSize: "2.5rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "30px",
                  fontFamily: "Texturina",
                }}
              >
                SEGi Student Personal Management Portal
              </div>
            </div>
            <div style={{ border: "1px grey solid" }}></div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: "60px",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  paddingBottom: "30px",
                  fontFamily: "Texturina",
                  textDecoration: "underline",
                }}
              >
                Admin Login
              </div>
              <div className="input-group">
                <input
                  id="personal_email"
                  className="labelInput"
                  type="text"
                  required
                ></input>
                <label>Email</label>
              </div>
              <div className="input-group">
                <input
                  id="password"
                  className="labelInput"
                  type="password"
                  required
                ></input>
                <label>Password</label>
                <span id="togglePassword" onClick={togglePassword}>
                  <i className="fa-regular fa fa-eye-slash"></i>
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  width: "300px",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={forgotpassword}
              >
                Forgot Password?
              </div>

              <button
                type="button"
                // className="loginBtn"
                className="all_modal_button_style create_modal_button"
                id="login"
                onClick={loginbtn}
              >
                Login
              </button>
              <div style={{ marginTop: "10px" }}>
                Don't have an account? <Link to="/register">Register here</Link>
              </div>
            </div>
          </div>
        </div>

        {showForm && <ForgotPassword open={showForm} onClose={closeModal} />}
      </div>
    </div>
  );
}

export default Login;
