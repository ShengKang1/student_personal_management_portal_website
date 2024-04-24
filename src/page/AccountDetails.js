import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
  updateDoc,
  getDocs,
  doc,
  firestore,
  collection,
  query,
  where,
} from "../firebase";
import Swal from "sweetalert2";
import ForgotPassword from "./ForgotPassword";

function AccountDetails() {
  const navigate = useNavigate();

  const transferredAdminEmail = sessionStorage.getItem("personal_email");
  const transferredAdminPassword = sessionStorage.getItem("password");
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const studentInfoRef = useRef(user);

  const getLastestInfo = () => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // console.log(unsubscribe);
  };

  useEffect(() => {
    studentInfoRef.current = user;
    if (user && user.email) {
      setEmail(user.email); // Log the email when it's available
    }
  }, [user]);

  useEffect(() => {
    getLastestInfo();
    fetchData();
  }, []);

  // if (studentInfoRef.current && studentInfoRef.current.email) {
  //   const email = studentInfoRef.current.email;
  //   console.log(email);
  // }

  // console.log(studentInfoRef);

  const fetchData = async () => {
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // if (!user || !user.email) {
      //   throw new Error("User email not available");
      // }

      const admingetDocs = await getDocs(
        query(
          collection(firestore, "admin"),
          where("personal_email", "==", transferredAdminEmail)
        )
      );

      if (!admingetDocs.empty) {
        admingetDocs.forEach((doc) => {
          const adminData = doc.data();
          const admin_id = adminData.admin_id;
          const admin_name = adminData.admin_name;
          const personal_email = adminData.personal_email;
          const phone_number = adminData.phone_number;

          document.getElementById("admin_id").value = admin_id;
          document.getElementById("admin_name").value = admin_name;
          document.getElementById("personal_email").value = personal_email;
          document.getElementById("phone_number").value = phone_number;
        });
      } else {
        console.log("No documents found for the provided email");
      }

      // console.log(admingetDoc.data());
      Swal.close();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error rejecting data",
        text: error.message + "Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  // const Updatebtn = async () => {
  //   Swal.fire({
  //     title: "Updating...",
  //     allowOutsideClick: false,
  //     showCancelButton: false,
  //     showConfirmButton: false,
  //     willOpen: () => {
  //       Swal.showLoading();
  //     },
  //   });

  //   const admin_id = document.getElementById("admin_id").value.trim();
  //   const admin_name = document.getElementById("admin_name").value.trim();
  //   const personal_email = document
  //     .getElementById("personal_email")
  //     .value.trim();
  //   const phone_number = document.getElementById("phone_number").value.trim();

  //   try {
  //     // await signInWithEmailAndPassword(user.email, transferredAdminPassword);

  //     // updateEmail(auth.currentUser, personal_email);
  //     const user = auth.currentUser;
  //     await user.updateEmail(personal_email);

  //     const adminSnapshot = await getDocs(
  //       query(
  //         collection(firestore, "admin"),
  //         where("personal_email", "==", transferredAdminEmail)
  //       )
  //     );
  //     if (!adminSnapshot.empty) {
  //       const adminDoc = adminSnapshot.docs[0]; // Assuming only one document matches the query
  //       const adminRef = doc(firestore, "admin", adminDoc.id);
  //       await updateDoc(adminRef, {
  //         admin_id: admin_id,
  //         admin_name: admin_name,
  //         personal_email: personal_email,
  //         phone_number: phone_number,
  //       });

  //       Swal.fire({
  //         icon: "success",
  //         title: "Updated successfully",
  //         allowOutsideClick: false,
  //         confirmButtonText: "OK",
  //       }).then(() => {
  //         window.location.reload("/accountdetails");
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: "No admin document found for the provided email",
  //         allowOutsideClick: false,
  //       });
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Error updating account: " + error.message,
  //       allowOutsideClick: false,
  //     });
  //     return;
  //   }
  // };

  //Completed
  const Updatebtn = async () => {
    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    const admin_id = document.getElementById("admin_id").value.trim();
    const admin_name = document.getElementById("admin_name").value.trim();
    const personal_email = document
      .getElementById("personal_email")
      .value.trim();
    const phone_number = document.getElementById("phone_number").value.trim();

    console.log(transferredAdminPassword);
    try {
      if (user === null) {
        // User is not signed in
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User is not signed in",
          allowOutsideClick: false,
        });
        return;
      }

      // Reauthenticate the user before updating the email
      const credential = EmailAuthProvider.credential(
        transferredAdminEmail,
        transferredAdminPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update the email after successful reauthentication
      await updateEmail(auth.currentUser, personal_email);

      // Update other user details in Firestore admin collection
      const adminSnapshot = await getDocs(
        query(
          collection(firestore, "admin"),
          where("personal_email", "==", transferredAdminEmail)
        )
      );
      if (!adminSnapshot.empty) {
        const adminDoc = adminSnapshot.docs[0]; // Assuming only one document matches the query
        const adminRef = doc(firestore, "admin", adminDoc.id);
        await updateDoc(adminRef, {
          admin_id: admin_id,
          admin_name: admin_name,
          personal_email: personal_email,
          phone_number: phone_number,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No admin document found for the provided email",
          allowOutsideClick: false,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Updated successfully. Please login again, thank you.",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then(() => {
        // window.location.reload("/accountdetails");
        // window.location.reload("/");
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error updating account: " + error.message,
        allowOutsideClick: false,
      });
      return;
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
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: "50px",
          borderRadius: "30px",
          backgroundColor: "white",
          margin: "20px",
          overflow: "hidden",
          width: "max-content",
          boxShadow:
            "rgba(0, 0, 0, 0.5) 0px 0px 2px, rgba(0, 0, 0, 0.8) 0px 4px 8px",
        }}
      >
        <div
          style={{
            padding: "0 10px 10px 10px",
            fontSize: "2em",
            textDecoration: "underline",
          }}
        >
          Manage Account
        </div>

        <div
          style={{
            display: "flex",
          }}
        >
          <div>
            <div className="all_modal_label_input">
              <label className="all_modal_label">Admin ID</label>
              <input
                id="admin_id"
                className="all_modal_input"
                type="text"
                required
              ></input>
            </div>

            <div className="all_modal_label_input">
              <label className="all_modal_label">Name</label>
              <input
                id="admin_name"
                className="all_modal_input"
                type="text"
                required
              ></input>
            </div>
            <div className="all_modal_label_input">
              <label className="all_modal_label">Personal Email</label>
              <input
                id="personal_email"
                className="all_modal_input"
                type="text"
                required
              ></input>
            </div>
            <div className="all_modal_label_input">
              <label className="all_modal_label">Phone Number</label>
              <input
                id="phone_number"
                className="all_modal_input"
                type="text"
                required
              ></input>
            </div>

            {/* <div className="clabel-input">
              <label>Admin ID</label>
              <input
                className="label-input"
                id="admin_id"
                type="text"
                required
              ></input>
            </div>
            <div className="clabel-input">
              <label>Admin Name</label>
              <input
                className="label-input"
                id="admin_name"
                type="text"
                placeholder="Admin Name"
                required
              ></input>
            </div>

            <div className="clabel-input">
              <label>Personal Email</label>
              <input
                className="label-input"
                id="personal_email"
                type="text"
                placeholder="Personal Email"
                required
              ></input>
            </div>

            <div className="clabel-input">
              <label>Phone Number</label>
              <input
                className="label-input"
                id="phone_number"
                type="text"
                placeholder="Phone Number"
                required
              ></input>
            </div> */}
          </div>
        </div>
        <div className="all_modal_button_position">
          <button
            type="button"
            className="all_modal_button_style close_modal_button"
            onClick={forgotpassword}
          >
            Reset Password
          </button>
          <button
            type="button"
            className="all_modal_button_style update_modal_button"
            onClick={Updatebtn}
          >
            Update Information
          </button>
        </div>
      </div>

      {showForm && <ForgotPassword open={showForm} onClose={closeModal} />}
    </div>
  );
}

export default AccountDetails;
