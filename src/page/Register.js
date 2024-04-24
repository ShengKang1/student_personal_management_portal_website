import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  firestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  auth,
  createUserWithEmailAndPassword,
} from "../firebase";
import SEGi_Background from "../assets/SEGi_Background.png";
import "../css/Register.css";

function Register() {
  const navigate = useNavigate();

  const registerBtn = async () => {
    const admin_id = document.getElementById("admin_id").value.trim();
    const admin_name = document.getElementById("admin_name").value.trim();
    const personal_email = document
      .getElementById("personal_email")
      .value.trim();
    const phone_number = document.getElementById("phone_number").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm_password = document
      .getElementById("confirm_password")
      .value.trim();

    if (
      admin_id === "" ||
      admin_name === "" ||
      personal_email === "" ||
      phone_number === "" ||
      password === "" ||
      confirm_password === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Please fill in all fill",
        text: "Invalid credentials",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
      return;
    }

    if (password !== confirm_password) {
      Swal.fire({
        icon: "error",
        title: "Password Not Same",
        text: "Password Not Same",
        allowOutsideClick: false,
        showConfirmButton: "OK",
      });
      return;
    }

    Swal.fire({
      title: "Creating Account...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    // Check if the email already exists in the "admin" collection
    const adminRef = collection(firestore, "admin");
    const emailQuerySnapshot = await getDocs(
      query(adminRef, where("personal_email", "==", personal_email))
    );
    if (!emailQuerySnapshot.empty) {
      // Email already exists
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email already exists. Please choose a different email.",
        allowOutsideClick: false,
        showConfirmButton: "OK",
      });
      return;
    }

    // Check if the admin ID already exists in the "admin" collection
    const adminIdQuerySnapshot = await getDocs(
      query(adminRef, where("admin_id", "==", admin_id))
    );
    if (!adminIdQuerySnapshot.empty) {
      // Admin ID already exists
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Admin ID already exists. Please choose a different ID.",
        allowOutsideClick: false,
        showConfirmButton: "OK",
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, personal_email, password);

      await addDoc(collection(firestore, "admin"), {
        admin_id: admin_id,
        admin_name: admin_name,
        personal_email: personal_email,
        phone_number: phone_number,
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully",
        allowOutsideClick: false,
        showConfirmButton: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error creating account: " + error.message,
        allowOutsideClick: false,
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

  const ctogglePassword = () => {
    const passwordInput = document.getElementById("confirm_password");
    const togglePassword = document.getElementById("ctogglePassword");

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

  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${SEGi_Background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        // padding: "20px",
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
        <div className="all_modal_content" style={{ padding: "60px" }}>
          <div className="all_modal_content_change">
            <div
              style={{
                fontSize: "2rem",
                paddingBottom: "30px",
                fontFamily: "Texturina",
                textDecoration: "underline",
              }}
            >
              Admin Create Account
            </div>
            <div className="all_modal_subcontent_change">
              <div>
                <div className="createaccount_padding">
                  <div className="input-group">
                    <input
                      id="admin_id"
                      className="labelInput"
                      type="text"
                      required
                    ></input>
                    <label>Admin ID</label>
                  </div>
                </div>
                <div className="createaccount_padding">
                  <div className="input-group">
                    <input
                      id="admin_name"
                      className="labelInput"
                      type="text"
                      required
                    ></input>
                    <label>Name</label>
                  </div>
                </div>
                <div className="createaccount_padding">
                  <div className="input-group">
                    <input
                      id="personal_email"
                      className="labelInput"
                      type="text"
                      required
                    ></input>
                    <label>Email</label>
                  </div>
                </div>
              </div>
              <div>
                <div className="createaccount_padding">
                  <div className="input-group">
                    <input
                      id="phone_number"
                      className="labelInput"
                      type="text"
                      required
                    ></input>
                    <label>Phone Number</label>
                  </div>
                </div>
                <div className="createaccount_padding">
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
                </div>
                <div className="createaccount_padding">
                  <div className="input-group">
                    <input
                      id="confirm_password"
                      className="labelInput"
                      type="password"
                      required
                    ></input>
                    <label>Confirm Password</label>
                    <span id="ctogglePassword" onClick={ctogglePassword}>
                      <i className="fa-regular fa fa-eye-slash"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="all_modal_button_position">
              <button
                type="button"
                // className="loginBtn"
                className="all_modal_button_style create_modal_button"
                id="login"
                onClick={registerBtn}
              >
                Create Account
              </button>
            </div>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Already have an account?{" "}
              <Link style={{ padding: "0" }} to="/">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
