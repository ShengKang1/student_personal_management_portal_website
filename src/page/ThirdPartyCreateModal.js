import React, { useEffect, useState } from "react";
import { addDoc, collection, firestore } from "../firebase";
import "../assets/utilities/Global_Design.css";
import Swal from "sweetalert2";

function ThirdPartyCreateModal(props) {
  if (!props.open) return null;
  const [thirdPartyInformation, setThirdPartyInformation] = useState({
    title: "",
    link: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setThirdPartyInformation({ ...thirdPartyInformation, [name]: value });
  };

  const createBtn = async () => {
    if (
      thirdPartyInformation.title === "" ||
      thirdPartyInformation.link === ""
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
      title: "Creating... Third Party",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await addDoc(collection(firestore, "third_party"), {
        title: thirdPartyInformation.title,
        link: thirdPartyInformation.link,
      });

      Swal.fire({
        icon: "success",
        title: "Successfully",
        text: "Third Party Created successfully.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload("/thirdparty");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error creating third party",
        text: "Error : " + error.message + ". Sorry, please try again.",
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
        <div className="all_modal_title">Create Third Party</div>
        <div style={{ display: "flex" }}>
          <div>
            <div className="all_modal_label_input">
              <label className="all_modal_label">Third Party Title</label>
              <input
                name="title"
                className="all_modal_input"
                type="text"
                value={thirdPartyInformation.title}
                placeholder="Title"
                onChange={handleInputChange}
                required
              ></input>
            </div>
            <div className="all_modal_label_input">
              <label className="all_modal_label">Third Party Link</label>
              <input
                name="link"
                className="all_modal_input"
                type="text"
                value={thirdPartyInformation.link}
                placeholder="Enter link URL"
                onChange={handleInputChange}
                required
              ></input>
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
  );
}

export default ThirdPartyCreateModal;
