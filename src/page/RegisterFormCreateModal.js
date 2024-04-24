import React, { useEffect, useState } from "react";
import {
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  where,
  updateDoc,
  query,
  collection,
  firestore,
} from "../firebase";
import "../assets/utilities/Global_Design.css";
import Swal from "sweetalert2";
import $ from "jquery";
import "./RegisterForm.css";

function RegisterFormCreateModal(props) {
  if (!props.open) return null;

  let noteDefaultValue = `Note 1`;

  const [selectAllCourse, setSelectAllCourse] = useState(false);

  const [getCourseName, setCourseName] = useState([]);
  const [getSelectedCourse, setSelectedCourse] = useState([]);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseCollection = await getDocs(
          query(
            collection(firestore, "course"),
            where("registerStatus", "==", "open")
          )
        );
        const courseData = courseCollection.docs.map((doc) => {
          const data = doc.data();
          const groupInfo =
            data.group && data.group !== "none" ? ` (${data.group})` : "";

          return `${data.course_code} ${data.course_name}${groupInfo}`;
        });

        setCourseName(courseData);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchCourse();
  }, []);

  const createBtn = async () => {
    const title = document.getElementById("title").value.trim();
    const startDate = document.getElementById("startDate").value.trim();
    const endDate = document.getElementById("endDate").value.trim();
    const note = document.getElementById("note").value.trim();

    const selectedRows = $(".rowCheckbox:checked")
      .map(function () {
        return dataTable.row($(this).closest("tr")).data();
      })
      .toArray();

    if (title === "" || startDate === "" || endDate === "" || note === "") {
      Swal.fire({
        icon: "error",
        title: "Please fill in all fill",
        text: "Invalid credentials",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
      return;
    }

    if (getSelectedCourse.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No rows selected",
        text: "Please select at least one course to create form.",
        confirmButtonText: "OK",
      });
    }

    try {
      Swal.fire({
        title: "Processing",
        text: "Creating form, please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      await addDoc(collection(firestore, "course_register_form"), {
        title: title,
        startDate: startDate,
        endDate: endDate,
        note: note,
        selectedCourses: getSelectedCourse,
      });

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Create Form successfully",
        text: "Form created.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload("/courseregister");
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error creating data",
        text: "Error create form: " + error.message + "Please try again.",
        allowOutsideClick: false,
      });
    }
  };

  const handleCourseCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCourse((prevValues) => [...prevValues, value]);
    } else {
      setSelectedCourse((prevValues) =>
        prevValues.filter((val) => val !== value)
      );
    }
  };

  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setSelectAllCourse(checked);
    setSelectedCourse(checked ? getCourseName : []);
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
          <div className="all_modal_title">Create Register Form</div>
          <div className="all_modal_subcontent_change">
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Form Title</label>
                <input
                  id="title"
                  placeholder="Title"
                  className="all_modal_input"
                  type="text"
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Start Date:</label>
                <input
                  id="startDate"
                  name="startDate"
                  className="all_modal_input"
                  type="date"
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">End Date:</label>
                <input
                  id="endDate"
                  name="endDate"
                  className="all_modal_input"
                  type="date"
                  required
                ></input>
              </div>
            </div>
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Note</label>
                <textarea
                  className="all_modal_input"
                  placeholder="Note"
                  id="note"
                  name="note"
                  defaultValue={noteDefaultValue}
                  style={{ height: "300px" }}
                ></textarea>
              </div>
            </div>
            <div>
              <div className="course-register-table">
                <div style={{ fontSize: "18px", textDecoration: "underline" }}>
                  Course status is : "open"
                </div>
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selectAllCourse}
                      onChange={handleSelectAllChange}
                    />
                    Select All Courses
                  </label>
                  {getCourseName.map((courseValue) => (
                    <div
                      style={{
                        margin: "10px 10px 10px 0px",
                        width: "max-content",
                      }}
                      key={courseValue}
                    >
                      <label style={{ marginRight: "10px" }}>
                        <input
                          type="checkbox"
                          value={courseValue}
                          checked={getSelectedCourse.includes(courseValue)}
                          onChange={handleCourseCheckboxChange}
                        />
                        {courseValue}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="all_modal_button_position">
            <button
              onClick={createBtn}
              className="all_modal_button_style create_modal_button"
            >
              Create
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

export default RegisterFormCreateModal;
