// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import {
//   firestore,
//   doc,
//   getDoc,
//   setDoc,
//   addDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   auth,
//   createUserWithEmailAndPassword,
// } from "../firebase";
// import SEGi_Background from "../assets/SEGi_Background.png";
// import "../css/Register.css";

// function Register() {
//   const navigate = useNavigate();

//   const registerBtn = async () => {
//     const admin_id = document.getElementById("admin_id").value.trim();
//     const admin_name = document.getElementById("admin_name").value.trim();
//     const personal_email = document
//       .getElementById("personal_email")
//       .value.trim();
//     const phone_number = document.getElementById("phone_number").value.trim();
//     const password = document.getElementById("password").value.trim();
//     const confirm_password = document
//       .getElementById("confirm_password")
//       .value.trim();

//     if (
//       admin_id === "" ||
//       admin_name === "" ||
//       personal_email === "" ||
//       phone_number === "" ||
//       password === "" ||
//       confirm_password === ""
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Please fill in all fill",
//         text: "Invalid credentials",
//         allowOutsideClick: false,
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     if (password !== confirm_password) {
//       Swal.fire({
//         icon: "error",
//         title: "Password Not Same",
//         text: "Password Not Same",
//         allowOutsideClick: false,
//         showConfirmButton: "OK",
//       });
//       return;
//     }

//     Swal.fire({
//       title: "Logging in...",
//       allowOutsideClick: false,
//       showCancelButton: false,
//       showConfirmButton: false,
//       willOpen: () => {
//         Swal.showLoading();
//       },
//     });

//     // Check if the email already exists in the "admin" collection
//     const adminRef = collection(firestore, "admin");
//     const emailQuerySnapshot = await getDocs(
//       query(adminRef, where("personal_email", "==", personal_email))
//     );
//     if (!emailQuerySnapshot.empty) {
//       // Email already exists
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Email already exists. Please choose a different email.",
//         allowOutsideClick: false,
//         showConfirmButton: "OK",
//       });
//       return;
//     }

//     // Check if the admin ID already exists in the "admin" collection
//     const adminIdQuerySnapshot = await getDocs(
//       query(adminRef, where("admin_id", "==", admin_id))
//     );
//     if (!adminIdQuerySnapshot.empty) {
//       // Admin ID already exists
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Admin ID already exists. Please choose a different ID.",
//         allowOutsideClick: false,
//         showConfirmButton: "OK",
//       });
//       return;
//     }

//     try {
//       await createUserWithEmailAndPassword(auth, personal_email, password);

//       await addDoc(collection(firestore, "admin"), {
//         admin_id: admin_id,
//         admin_name: admin_name,
//         personal_email: personal_email,
//         phone_number: phone_number,
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: "Account created successfully",
//         allowOutsideClick: false,
//         showConfirmButton: "OK",
//       }).then(() => {
//         navigate("/");
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Error creating account: " + error.message,
//         allowOutsideClick: false,
//       });
//     }
//   };

//   const togglePassword = () => {
//     const passwordInput = document.getElementById("password");
//     const togglePassword = document.getElementById("togglePassword");

//     if (passwordInput) {
//       if (passwordInput.type === "password") {
//         passwordInput.type = "text";
//         togglePassword.innerHTML = '<i class="fa-regular fa fa-eye"></i>';
//       } else {
//         passwordInput.type = "password";
//         togglePassword.innerHTML = '<i class="fa-regular fa fa-eye-slash"></i>';
//       }
//     }
//   };

//   const ctogglePassword = () => {
//     const passwordInput = document.getElementById("confirm_password");
//     const togglePassword = document.getElementById("ctogglePassword");

//     if (passwordInput) {
//       if (passwordInput.type === "password") {
//         passwordInput.type = "text";
//         togglePassword.innerHTML = '<i class="fa-regular fa fa-eye"></i>';
//       } else {
//         passwordInput.type = "password";
//         togglePassword.innerHTML = '<i class="fa-regular fa fa-eye-slash"></i>';
//       }
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         width: "100vw",
//         backgroundImage: `url(${SEGi_Background})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         // padding: "20px",
//       }}
//     >
//       <div
//         style={{
//           padding: "20px",
//           borderRadius: "30px",
//           backgroundColor: "white",
//           height: "80vh",
//           margin: "20px",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ padding: "10px", fontSize: "3em" }}>
//           SEGi Student Personal Management Portal
//         </div>
//         <div
//           style={{
//             padding: "0 10px 10px 10px",
//             fontSize: "2em",
//             textDecoration: "underline",
//           }}
//         >
//           Create Account
//         </div>

//         <div
//           style={{
//             display: "flex",
//             // flexDirection: "row",
//             justifyContent: "space-evenly",
//             marginTop: "4px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               width: "300px",
//             }}
//           >
//             <div className="clabel-input">
//               <label>Admin ID</label>
//               <input
//                 className="label-input"
//                 id="admin_id"
//                 type="text"
//                 placeholder="Admin ID"
//                 required
//               ></input>
//             </div>

//             <div className="clabel-input">
//               <label>Admin Name</label>
//               <input
//                 className="label-input"
//                 id="admin_name"
//                 type="text"
//                 placeholder="Admin Name"
//                 required
//               ></input>
//             </div>

//             <div className="clabel-input">
//               <label>Personal Email</label>
//               <input
//                 className="label-input"
//                 id="personal_email"
//                 type="text"
//                 placeholder="Personal Email"
//                 required
//               ></input>
//             </div>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               width: "300px",
//             }}
//           >
//             <div className="clabel-input">
//               <label>Phone Number</label>
//               <input
//                 className="label-input"
//                 id="phone_number"
//                 type="text"
//                 placeholder="Phone Number"
//                 required
//               ></input>
//             </div>

//             <div className="clabel-input">
//               <label>Password</label>
//               <div>
//                 <input
//                   className="label-input"
//                   id="password"
//                   type="password"
//                   placeholder="Password"
//                   required
//                 ></input>
//                 <span id="togglePassword" onClick={togglePassword}>
//                   <i className="fa-regular fa fa-eye-slash"></i>
//                 </span>
//               </div>
//             </div>

//             <div className="clabel-input">
//               <label>Confirm Password</label>
//               <input
//                 className="label-input"
//                 id="confirm_password"
//                 type="password"
//                 placeholder="Confirm Password"
//                 required
//               ></input>
//               <span id="ctogglePassword" onClick={ctogglePassword}>
//                 <i className="fa-regular fa fa-eye-slash"></i>
//               </span>
//             </div>
//           </div>
//         </div>
//         <div
//           style={{
//             width: "100%",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <button type="button" className="registerBtn" onClick={registerBtn}>
//             Create Account
//           </button>

//           <div style={{ marginTop: "10px" }}>
//             <p>
//               Don't have an account? <Link to="/">Login here</Link>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
