import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import Swal from "sweetalert2";
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  addDoc,
  deleteDoc,
  collection,
  where,
  firestore,
} from "../firebase";

function TimetableCreateModal(props) {
  if (!props.open) return null;
  const getCourseData = props.courseData;
  const [eventInformation, setEventInformation] = useState({
    course: "",
    lecturer: "",
    class: "",
    dayOfWeek: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    color: "#3788d8",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventInformation({ ...eventInformation, [name]: value });
  };

  const handleColorChange = (color) => {
    setEventInformation({ ...eventInformation, color: color.hex });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [getstudentNumber, setStudentNumber] = useState("");
  const [getStudentAmount, setStudentAmount] = useState([]);
  const [getstudentTotalNumber, setStudentTotalNumber] = useState("");

  const handleCourseSelect = (e) => {
    const selectedCourse = e.target.value;
    checkIntake(selectedCourse);
  };

  const checkIntake = async (selectedCourse) => {
    setIsLoading(true);
    const courseString = selectedCourse;
    const parts = courseString.split(" ");
    const courseCode = parts[0]; // "TCS3064"
    // console.log("Course Code:", courseCode);

    try {
      const courseCollection = await getDoc(
        doc(firestore, "course", courseCode)
      );
      const courseData = courseCollection.data();
      const courseIntake = courseData.intake;
      //   console.log(courseIntake);

      const studentDataCollection = collection(firestore, "student_data");

      let amount = [];
      let totalNumberOfStudents = 0;
      let intakeStudentCounts = {};

      for (const intakeValue of courseIntake) {
        const q = query(
          studentDataCollection,
          where("intake", "==", intakeValue)
        );

        const snapshot = await getDocs(q);
        const numberOfStudents = snapshot.size;

        amount.push(
          `Number of students for ${intakeValue}: ${numberOfStudents}`
        );
        intakeStudentCounts[intakeValue] = numberOfStudents;
        totalNumberOfStudents += numberOfStudents;
      }

      setStudentAmount(amount);
      setStudentTotalNumber(
        "The total number of students in this course is : " +
          totalNumberOfStudents
      );

      //   console.log(`Total number of students: ${totalNumberOfStudents}`);
      setStudentNumber(Object.values(intakeStudentCounts).join(", "));

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error checking intake:", error);
    }
  };

  const generateId = () => {
    const prefix = "id_";
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 6);
    return prefix + timestamp + "_" + randomPart;
  };

  const createBtn = async () => {
    if (
      eventInformation.course === "" ||
      eventInformation.lecturer === "" ||
      eventInformation.class === "" ||
      eventInformation.dayOfWeek === "" ||
      eventInformation.startDate === "" ||
      eventInformation.endDate === "" ||
      eventInformation.startTime === "" ||
      eventInformation.endTime === ""
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

    Swal.fire({
      title: "Creating...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const customId = generateId();
      await setDoc(doc(collection(firestore, "course_timetable"), customId), {
        id: customId,
        course: eventInformation.course,
        startDate: eventInformation.startDate,
        endDate: eventInformation.endDate,
        startTime: eventInformation.startTime,
        endTime: eventInformation.endTime,
        studentAmount: getstudentNumber,
        lecturer: eventInformation.lecturer,
        class: eventInformation.class,
        dayOfWeek: eventInformation.dayOfWeek,
        eventColor: eventInformation.color,
      });

      Swal.fire({
        icon: "success",
        title: "Successfully",
        text: `Created timetable course for ${eventInformation.course} successfully.`,
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        props.onClose();
        window.location.reload("/timetable");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error creating timetable",
        text: "Error create timetable: " + error.message + "Please try again.",
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
          <div className="all_modal_title">Create Course Time</div>
          <div className="all_modal_subcontent_change">
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <div className="all_modal_label_input">
                <label className="all_modal_label">Set Event Color</label>
                <ChromePicker
                  color={eventInformation.color}
                  onChange={handleColorChange}
                />
              </div>
            </div>
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Select Course</label>
                <select
                  name="course"
                  className="timetablelabelInput"
                  value={eventInformation.course}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleCourseSelect(e);
                  }}
                  required
                >
                  <option value="">Select Course</option>
                  {getCourseData.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div
                  style={{
                    backgroundColor: "#d1d1d1",
                    height: "100px",
                    margin: "10px",
                    padding: "10px",
                    overflowY: "auto",
                    borderRadius: "10px",
                  }}
                >
                  <div style={{ textAlign: "center", paddingBottom: "5px" }}>
                    Student Amount
                  </div>
                  {eventInformation.course && (
                    <>
                      {isLoading ? (
                        <div>Loading...</div>
                      ) : (
                        <>
                          {getstudentTotalNumber}
                          {getStudentAmount.map((amount) => (
                            <div key={amount}>{amount}</div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Lecturer</label>
                <input
                  name="lecturer"
                  //   className="all_modal_input"
                  className="timetablelabelInput"
                  placeholder="Enter Lecturer Name"
                  type="text"
                  value={eventInformation.lecturer}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Classroom</label>
                <input
                  name="class"
                  //   className="all_modal_input"
                  className="timetablelabelInput"
                  placeholder="Enter Class Location"
                  type="text"
                  value={eventInformation.class}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
            </div>
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Day of the week</label>
                <select
                  name="dayOfWeek"
                  value={eventInformation.dayOfWeek}
                  onChange={handleInputChange}
                  className="timetablelabelInput"
                  required
                >
                  <option value="">Select Day</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                  <option value="0">Sunday</option>
                </select>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={eventInformation.startDate}
                  onChange={handleInputChange}
                  className="timetablelabelInput"
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={eventInformation.endDate}
                  onChange={handleInputChange}
                  className="timetablelabelInput"
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">Start Time</label>
                <select
                  name="startTime"
                  value={eventInformation.startTime}
                  onChange={handleInputChange}
                  className="timetablelabelInput"
                >
                  <option value="">Select Time</option>
                  {[...Array(12).keys()].map((hour) => (
                    <React.Fragment key={hour}>
                      <option
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >{`${hour.toString().padStart(2, "0")}:00 AM`}</option>
                      <option
                        value={`${hour.toString().padStart(2, "0")}:30`}
                      >{`${hour.toString().padStart(2, "0")}:30 AM`}</option>
                    </React.Fragment>
                  ))}
                  {[...Array(12).keys()].map((hour) => (
                    <React.Fragment key={hour + 12}>
                      <option
                        value={`${(hour + 12).toString().padStart(2, "0")}:00`}
                      >{`${(hour + 12)
                        .toString()
                        .padStart(2, "0")}:00 PM`}</option>
                      <option
                        value={`${(hour + 12).toString().padStart(2, "0")}:30`}
                      >{`${(hour + 12)
                        .toString()
                        .padStart(2, "0")}:30 PM`}</option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">End Time</label>
                <select
                  name="endTime"
                  value={eventInformation.endTime}
                  onChange={handleInputChange}
                  className="timetablelabelInput"
                >
                  <option value="">Select Time</option>
                  {[...Array(12).keys()].map((hour) => (
                    <React.Fragment key={hour}>
                      <option
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >{`${hour.toString().padStart(2, "0")}:00 AM`}</option>
                      <option
                        value={`${hour.toString().padStart(2, "0")}:30`}
                      >{`${hour.toString().padStart(2, "0")}:30 AM`}</option>
                    </React.Fragment>
                  ))}
                  {[...Array(12).keys()].map((hour) => (
                    <React.Fragment key={hour + 12}>
                      <option
                        value={`${(hour + 12).toString().padStart(2, "0")}:00`}
                      >{`${(hour + 12)
                        .toString()
                        .padStart(2, "0")}:00 PM`}</option>
                      <option
                        value={`${(hour + 12).toString().padStart(2, "0")}:30`}
                      >{`${(hour + 12)
                        .toString()
                        .padStart(2, "0")}:30 PM`}</option>
                    </React.Fragment>
                  ))}
                </select>
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

export default TimetableCreateModal;
