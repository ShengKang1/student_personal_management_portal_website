import React, { useEffect, useState } from "react";
import { doc, getDocs, updateDoc, collection, firestore } from "../firebase";
import "../assets/utilities/Global_Design.css";
import Swal from "sweetalert2";

function ManageAccountShowModal(props) {
  if (!props.open) return null;

  // const [studentName, setStudentName] = useState(props.studentName);
  // const [studentEmail, setStudentEmail] = useState(props.personalEmail);
  // const [studentPhoneNumber, setStudentPhoneNumber] = useState(props.phoneNumber);
  // const [studentIntake, setStudentIntake] = useState(props.intake);
  // const [studentProgramme, setStudentProgramme] = useState(props.programme);
  // const [studentSpecialization, setStudentSpecialization] = useState(props.specialization);

  const [accountInformation, setAccountInformation] = useState({
    studentName: props.studentName,
    personalEmail: props.personalEmail,
    phoneNumber: props.phoneNumber,
    intake: props.intake,
    programme: props.programme,
    specialization: props.specialization,
  });

  const programmes = props.programmeDropDownData;
  const specialization = props.specializationDropDownData;
  const intake = props.intakeDropDownData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInformation({ ...accountInformation, [name]: value });
  };

  const updateBtn = async () => {
    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await updateDoc(doc(firestore, "students", props.id), {
        student_name: accountInformation.studentName,
        personal_email: accountInformation.personalEmail,
        phone_number: accountInformation.phoneNumber,
        specialization: accountInformation.specialization,
        programme: accountInformation.programme,
        intake: accountInformation.intake,
      });

      Swal.fire({
        icon: "success",
        title: "Data updated successfully",
        text: "The student data has been updated.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload("/manageaccount");
      });

      props.onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error updating data",
        text: "Error update account: " + error.message + "Please try again.",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <div className="all_modal_background_design" onClick={props.onClose}>
      <div
        className="all_modal_content"
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click event from bubbling up
        }}
      >
        <div className="all_modal_content_change">
          <div className="all_modal_title">Manage Student Information</div>
          <div style={{ padding: "20px 0", fontSize: "20px" }}>
            Student ID : {props.studentId}
          </div>
          <div className="all_modal_subcontent_change">
            <div style={{ padding: "0px 20px" }}>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Student Name</label>
                <input
                  name="studentName"
                  className="all_modal_input"
                  type="text"
                  value={accountInformation.studentName}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Student Email</label>
                <input
                  name="personalEmail"
                  className="all_modal_input"
                  type="text"
                  value={accountInformation.personalEmail}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Phone Number</label>
                <input
                  name="phoneNumber"
                  className="all_modal_input"
                  type="text"
                  value={accountInformation.phoneNumber}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
            </div>
            <div style={{ padding: "0px 20px" }}>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Programme</label>
                <select
                  className="all_modal_input_dropdown_menu"
                  name="programme"
                  value={accountInformation.programme}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Programme</option>
                  {programmes.map((programme) => (
                    <option key={programme} value={programme}>
                      {programme}
                    </option>
                  ))}
                </select>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Specialization</label>
                <select
                  className="all_modal_input_dropdown_menu"
                  name="specialization"
                  value={accountInformation.specialization}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  {specialization.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Intake</label>
                <select
                  className="all_modal_input_dropdown_menu"
                  name="intake"
                  value={accountInformation.intake}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Intake</option>
                  {intake.map((intake) => (
                    <option key={intake} value={intake}>
                      {intake}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="all_modal_button_position">
            <button
              onClick={updateBtn}
              className="all_modal_button_style update_modal_button"
            >
              Update
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

export default ManageAccountShowModal;
