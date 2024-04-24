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
import Swal from "sweetalert2";

function RegisterFormManageModal(props) {
  if (!props.open) return null;

  const [searchRegisterFormData, setSearchRegisterFormData] = useState(null);
  const [registerFormData, setRegisterFormData] = useState({});
  const [selectAllCourse, setSelectAllCourse] = useState(false);
  const [getSelectedCourse, setSelectedCourse] = useState([]);
  const getCourseName = props.courseCheckBoxData;
  const allData = props.allData;
  const dataId = props.id;

  useEffect(() => {
    if (searchRegisterFormData) {
      setSelectedCourse(searchRegisterFormData.selectedCourses);
    }
  }, [searchRegisterFormData]);

  useEffect(() => {
    const searchInfo = allData.current.find((info) => info.id === dataId);
    setSearchRegisterFormData(searchInfo);

    // console.log(searchRegisterFormData);
    if (searchRegisterFormData) {
      setRegisterFormData({
        title: searchRegisterFormData.title,
        note: searchRegisterFormData.note,
        startDate: searchRegisterFormData.startDate,
        endDate: searchRegisterFormData.endDate,
      });
    }
  }, [allData, dataId, searchRegisterFormData]);

  //   console.log(searchRegisterFormData);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData({ ...registerFormData, [name]: value });
  };

  const updateBtn = async () => {
    if (
      registerFormData.title === "" ||
      registerFormData.startDate === "" ||
      registerFormData.endDate === "" ||
      registerFormData.note === ""
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
    if (getSelectedCourse.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least one course",
        allowOutsideClick: false,
      });
      return;
    }

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
      await updateDoc(doc(firestore, "course_register_form", props.id), {
        title: registerFormData.title,
        startDate: registerFormData.startDate,
        endDate: registerFormData.endDate,
        note: registerFormData.note,
        selectedCourses: getSelectedCourse,
      });

      await Swal.fire({
        icon: "success",
        title: "Update Form successfully",
        text: "Form updated.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload("/courseregister");
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error updating data",
        text: "Error update form: " + error.message + "Please try again.",
        allowOutsideClick: false,
      });
    }
  };

  const deleteBtn = async () => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      text: "Do you want to delete?",
      icon: "question",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await deleteDoc(doc(firestore, "course_register_form", props.id));

        await Swal.fire({
          icon: "success",
          title: "Data delete successfully",
          text: "The course data has been delete.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          window.location.reload("/courseregister");
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error delete data",
          text: "Error delete course: " + error.message + "Please try again.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
        return;
      }
    } else {
      Swal.close();
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
          <div className="all_modal_title">Manage Register Form</div>
          <div className="all_modal_subcontent_change">
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Form Title</label>
                <input
                  name="title"
                  placeholder="Title"
                  className="all_modal_input"
                  type="text"
                  value={registerFormData.title || ""}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Start Date:</label>
                <input
                  name="startDate"
                  className="all_modal_input"
                  type="date"
                  value={registerFormData.startDate || ""}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">End Date:</label>
                <input
                  name="endDate"
                  className="all_modal_input"
                  type="date"
                  value={registerFormData.endDate || ""}
                  onChange={handleInputChange}
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
                  name="note"
                  value={registerFormData.note || ""}
                  onChange={handleInputChange}
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
              onClick={updateBtn}
              className="all_modal_button_style create_modal_button"
            >
              Update
            </button>
            <button
              onClick={deleteBtn}
              className="all_modal_button_style delete_modal_button"
            >
              Delete
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

export default RegisterFormManageModal;
