import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  firestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
} from "../firebase.js";

function CourseCreateModal(props) {
  if (!props.open) return null;
  const [courseInformation, setcourseInformation] = useState({
    courseCode: "",
    courseName: "",
    creditHours: "",
    group: "none",
    registerStatus: "close",
  });
  const intakeDropDownData = props.intakeDropDownData;
  const creditHoursDropDownData = props.creditHoursDropDownData;
  // const classificationDropDownData = ["SE", "CN", "BSD", "Core", "Elective"];
  const classificationDropDownData = ["SE", "CN", "BSD"];
  const groupDropDownData = ["GROUP A", "GROUP B", "GROUP C"];
  const [getSelectedIntakeValues, setSelectedIntakeValues] = useState([]);
  const [getSelectedClassificationValues, setSelectedClassificationValues] =
    useState([]);
  const [hasRemark, setHasRemark] = useState(false);
  const [remarkValue, setRemarkValue] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setcourseInformation({ ...courseInformation, [name]: value });
  };

  const handleIntakeCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedIntakeValues((prevValues) => [...prevValues, value]);
    } else {
      setSelectedIntakeValues((prevValues) =>
        prevValues.filter((val) => val !== value)
      );
    }
  };

  const handleClassificationCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedClassificationValues((prevValues) => [...prevValues, value]);
    } else {
      setSelectedClassificationValues((prevValues) =>
        prevValues.filter((val) => val !== value)
      );
    }
  };

  const handleRemarkCheckboxChange = (e) => {
    setHasRemark(e.target.checked);
    if (!e.target.checked) {
      setRemarkValue("");
    }
  };

  const handleRemarkChange = (e) => {
    setRemarkValue(e.target.value);
  };

  const createBtn = async () => {
    if (
      courseInformation.courseCode === "" ||
      courseInformation.courseName === "" ||
      courseInformation.creditHours === ""
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

    if (getSelectedClassificationValues.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least one classification",
        allowOutsideClick: false,
      });
      return;
    }

    if (getSelectedIntakeValues.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least one intake",
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
      const coursegetDoc = await getDoc(
        doc(firestore, "course", courseInformation.courseCode)
      );
      if (coursegetDoc.exists()) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Course Code already exists. Please enter another course code",
          allowOutsideClick: false,
          showConfirmButton: "OK",
        });
        return;
      }

      const remarkData = remarkValue || "none";

      await setDoc(doc(firestore, "course", courseInformation.courseCode), {
        course_code: courseInformation.courseCode,
        course_name: courseInformation.courseName,
        credit_hour: courseInformation.creditHours,
        classification: getSelectedClassificationValues,
        intake: getSelectedIntakeValues,
        group: courseInformation.group,
        remark: remarkData,
        registerStatus: courseInformation.registerStatus,
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "New Course created successfully",
        allowOutsideClick: false,
        showConfirmButton: "OK",
      }).then(() => {
        window.location.reload("/createcourse");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error creating course: " + error.message,
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
          <div className="all_modal_title">Create New Course</div>
          <div className="all_modal_subcontent_change">
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">
                  New Course Code (e.g. TCS3064)
                </label>
                <input
                  name="courseCode"
                  className="all_modal_input"
                  type="text"
                  value={courseInformation.courseCode}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">New Course Name</label>
                <input
                  name="courseName"
                  className="all_modal_input"
                  type="text"
                  value={courseInformation.courseName}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Group</label>
                <select
                  className="all_modal_input_dropdown_menu"
                  name="group"
                  value={courseInformation.group}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Group</option>
                  {groupDropDownData.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="all_modal_label_input">
                <label className="all_modal_label">
                  <input
                    type="checkbox"
                    checked={hasRemark}
                    onChange={handleRemarkCheckboxChange}
                  />
                  Remark
                </label>
                {hasRemark && (
                  <input
                    className="all_modal_input"
                    type="text"
                    placeholder="Remark/Pre-requisite"
                    name="remark"
                    value={courseInformation.remarkValue}
                    onChange={handleRemarkChange}
                  />
                )}
              </div>
            </div>
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Credit Hours</label>
                <select
                  className="all_modal_input_dropdown_menu"
                  name="creditHours"
                  value={courseInformation.creditHours}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Credit Hour</option>
                  {creditHoursDropDownData.map((hours) => (
                    <option key={hours} value={hours}>
                      {hours}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="all_modal_label_input"
                style={{ marginTop: "30px" }}
              >
                <label className="all_modal_label">Classification</label>
                <div
                  style={{
                    // backgroundColor: "yellow",
                    height: "180px",
                    width: "300px",
                    overflowY: "auto",
                    marginTop: "10px",
                  }}
                >
                  {classificationDropDownData.map((classificationValue) => (
                    <div
                      style={{
                        margin: "10px 10px 10px 0px",
                        width: "max-content",
                      }}
                      key={classificationValue}
                    >
                      <label>
                        <input
                          type="checkbox"
                          value={classificationValue}
                          checked={getSelectedClassificationValues.includes(
                            classificationValue
                          )}
                          onChange={handleClassificationCheckboxChange}
                        />
                        {classificationValue}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Intake</label>
                <div
                  style={{
                    // backgroundColor: "yellow",
                    height: "180px",
                    width: "300px",
                    overflowY: "auto",
                    marginTop: "10px",
                  }}
                >
                  {intakeDropDownData.map((intakeValue) => (
                    <div
                      style={{
                        margin: "10px 10px 10px 0px",
                        width: "max-content",
                      }}
                      key={intakeValue}
                    >
                      <label>
                        <input
                          type="checkbox"
                          value={intakeValue}
                          checked={getSelectedIntakeValues.includes(
                            intakeValue
                          )}
                          // onChange={handleInputChange}
                          onChange={handleIntakeCheckboxChange}
                        />
                        {intakeValue}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">
                  <input
                    name="registerStatus"
                    type="checkbox"
                    value={courseInformation.registerStatus}
                    checked={courseInformation.registerStatus === "open"}
                    onChange={(e) =>
                      setcourseInformation({
                        ...courseInformation,
                        registerStatus: e.target.checked ? "open" : "close",
                      })
                    }
                  />
                  Open Register
                </label>
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

export default CourseCreateModal;
