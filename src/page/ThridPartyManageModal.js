import React, { useState } from "react";
import { doc, deleteDoc, firestore, updateDoc } from "../firebase";
import "../assets/utilities/Global_Design.css";
import Swal from "sweetalert2";

function ThirdPartyManageModal(props) {
  if (!props.open) return null;
  const [thirdPartyInformation, setThirdPartyInformation] = useState({
    title: props.title,
    link: props.link,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setThirdPartyInformation({ ...thirdPartyInformation, [name]: value });
  };

  const updateBtn = async () => {
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
      title: "Updating... Third Party",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await updateDoc(doc(firestore, "third_party", props.id), {
        title: thirdPartyInformation.title,
        link: thirdPartyInformation.link,
      });

      Swal.fire({
        icon: "success",
        title: "Update Successfully",
        text: "Third Party data update successfully.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload("/thirdparty");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error updating third party data",
        text: "Error : " + error.message + ". Sorry, please try again.",
        allowOutsideClick: false,
      });
    }
  };

  const deleteBtn = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Confirm Delete?",
      text: `Do you want to delete ${props.title}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting... Third Party",
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await deleteDoc(doc(firestore, "third_party", props.id));

        Swal.fire({
          icon: "success",
          title: "Delete Successfully",
          text: "Third Party data delete successfully.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          window.location.reload("/thirdparty");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error deleting third party data",
          text: "Error : " + error.message + ". Sorry, please try again.",
          allowOutsideClick: false,
        });
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
        <div className="all_modal_title">Manage Third Party</div>
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
  );
}

export default ThirdPartyManageModal;
