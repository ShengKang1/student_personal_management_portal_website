import React, { useEffect, useState } from "react";
import {
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  firestore,
} from "../firebase";
import "../assets/utilities/Global_Design.css";
import Swal from "sweetalert2";

function CourseManageModal(props) {
  if (!props.open) return null;
  // const classificationValues = props.classification;
  // data = classificationValues.split(",");
  // console.log(data);
  const [remarkValue, setRemarkValue] = useState("");
  const [courseInformation, setcourseInformation] = useState({
    creditHours: props.creditHours,
    registerStatus: props.registerStatus,
  });

  const intakeDropDownData = props.intakeDropDownData;
  const creditHoursDropDownData = props.creditHoursDropDownData;
  const classificationDropDownData = ["SE", "CN", "BSD"];
  // const groupDropDownData = ["GROUP A", "GROUP B", "GROUP C"];
  const [getSelectedIntakeValues, setSelectedIntakeValues] = useState(
    props.intake
  );
  const [getSelectedClassificationValues, setSelectedClassificationValues] =
    useState(props.classification);
  const [hasRemark, setHasRemark] = useState(false);

  useEffect(() => {
    // Check if remark is not equal to "none" and set manageHasRemark to true
    if (props.remark !== "none") {
      setHasRemark(true);
    } else {
      setHasRemark(false);
    }

    setRemarkValue(props.remark);
  }, [props.remark]);

  useEffect(() => {
    setcourseInformation((prevCourseInformation) => ({
      ...prevCourseInformation,
      remark: remarkValue,
    }));
  }, [remarkValue]);

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

  const updateBtn = async () => {
    if (courseInformation.creditHours === "") {
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
      let remarkData = courseInformation.remark;

      if (courseInformation.remark === "") {
        remarkData = "none";
      }

      await updateDoc(doc(firestore, "course", props.id), {
        credit_hour: courseInformation.creditHours,
        intake: getSelectedIntakeValues,
        classification: getSelectedClassificationValues,
        remark: remarkData,
        registerStatus: courseInformation.registerStatus,
      });
      await Swal.fire({
        icon: "success",
        title: "Data updated successfully",
        text: "The course data has been updated.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload("/course");
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error updating data",
        text: "Error update course: " + error.message + "Please try again.",
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
        await deleteDoc(doc(firestore, "course", props.id));

        await Swal.fire({
          icon: "success",
          title: "Data delete successfully",
          text: "The course data has been delete.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          window.location.reload("/managecourse");
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
          <div className="all_modal_title">Manage Course Information</div>
          <div style={{ padding: "20px 0", fontSize: "20px" }}>
            Course :
            {props.courseCode +
              " " +
              props.courseName +
              (props.group !== "none" ? " (" + props.group + ")" : "")}
          </div>
          <div className="all_modal_subcontent_change">
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
                    value={courseInformation.remark}
                    onChange={handleRemarkChange}
                  />
                )}
              </div>
            </div>
            <div>
              <div className="all_modal_label_input">
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
              onClick={updateBtn}
              className="all_modal_button_style update_modal_button"
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

export default CourseManageModal;
