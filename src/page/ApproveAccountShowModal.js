import React from "react";
import "./ApproveAccount.css";

function ApproveAccountShowModal(props) {
  const dateObject = props.request_at.toDate();

  if (!props.open) return null;

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear() % 100;
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const date = formatDate(dateObject);
  const time = formatTime(dateObject);

  return (
    <div>
      {/* {props.id}
      <div>{date}</div> */}
      <div
        // style={{
        //   top: 0,
        //   left: 0,
        //   position: "absolute",
        //   width: "100%",
        //   height: "100%",
        //   display: "flex",
        //   // placeItems: "center",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   backgroundColor: "rgba(114,115,114,0.5)",
        //   backdropFilter: "blur(5px)",
        //   zIndex: "2",
        // }}
        className="all_modal_background_design"
        onClick={props.onClose}
      >
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
                <div>Request Date : {date}</div>
                <div>Request Time : {time}</div>
                <div>Status : {props.status}</div>
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

export default ApproveAccountShowModal;
