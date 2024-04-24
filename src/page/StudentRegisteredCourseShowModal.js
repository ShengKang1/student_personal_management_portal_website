import React from "react";

function StudentRegisteredCourseShowModal(props) {
  const student_id = props.student_id;
  const registed_courses = props.registed_courses;

  const coursesList = registed_courses.map((course, index) => (
    <li key={index}>{course}</li>
  ));

  return (
    <div className="all_modal_background_design" onClick={props.onClose}>
      <div
        className="all_modal_content"
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click event from bubbling up
        }}
      >
        <div>Student ID : {student_id}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>Registered Courses :</div>
          <ul>{coursesList}</ul>
        </div>
      </div>
    </div>
  );
}

export default StudentRegisteredCourseShowModal;
