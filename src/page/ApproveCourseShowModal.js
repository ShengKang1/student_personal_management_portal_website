import React from "react";
// import "./AccountPendingShowModal.css";

function ApproveCourseShowModal(props) {
  if (!props.open) return null;

  return (
    <div>
      {/* {props.id}
      <div>{date}</div> */}
      <div className="all_modal_background_design" onClick={props.onClose}>
        <div
          className="all_modal_content"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up
          }}
        >
          <div className="all_modal_content_change">
            <div className="all_modal_subcontent_change">
              <div
                id={"account_pending_show_modal"}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div>Student ID : {props.student_id}</div>
                <div>Student Name : {props.student_name}</div>
                <div>Student Email : {props.personal_email}</div>
                <div>Phone Number : {props.phone_number}</div>
                <div>Programme : {props.programme}</div>
              </div>

              <div
                id={"account_pending_show_modal"}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div>Specialization : {props.specialization}</div>
                <div>Intake : {props.intake}</div>
              </div>
            </div>
            <div className="all_modal_button_position">
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
    </div>
  );
}

export default ApproveCourseShowModal;
