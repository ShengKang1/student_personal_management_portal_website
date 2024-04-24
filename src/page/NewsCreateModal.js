import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, firestore, addDoc, collection } from "../firebase";
import Swal from "sweetalert2";
import "./News.css";

function NewsCreateModal(props) {
  if (!props.open) return null;
  const [newsInformation, setNewsInformation] = useState({
    title: "",
    content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsInformation({ ...newsInformation, [name]: value });
  };

  const [img, setImg] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const createBtn = async () => {
    if (newsInformation.title === "" || newsInformation.content === "") {
      Swal.fire({
        icon: "error",
        title: "Please fill in all fill",
        text: "Invalid credentials",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
      return;
    }

    if (!img) {
      Swal.fire({
        icon: "error",
        title: "No image is selected",
        text: "Please select an image.",
        allowOutsideClick: false,
      });
      return;
    }

    try {
      Swal.fire({
        title: "Processing",
        text: "Creating news, please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      // Create a storage reference
      const storageRef = ref(storage, `images/${img.name}`);

      // Upload file to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress here if needed
        },
        (error) => {
          // Handle unsuccessful uploads here
          Swal.fire({
            icon: "error",
            title: "Error creating data",
            text: "Upload error:" + error + "Please try again.",
            allowOutsideClick: false,
          });
          // console.error("Upload error:", error);
          // alert("Failed to upload image");
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at:", downloadURL);
            addDoc(collection(firestore, "news"), {
              title: newsInformation.title,
              content: newsInformation.content,
              imageUrl: downloadURL,
              createdAt: new Date(),
            });
            // alert("Image uploaded successfully");
            // setImg(null);
            Swal.fire({
              icon: "success",
              title: "Create News successfully",
              text: "News created.",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            }).then(() => {
              window.location.reload("/news");
            });
          });
        }
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error creating data",
        text: "Error create form: " + error.message + "Please try again.",
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
          <div className="all_modal_title">Create New News</div>
          <div className="all_modal_subcontent_change">
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">News Title</label>
                <input
                  name="title"
                  className="all_modal_input"
                  placeholder="Enter title"
                  type="text"
                  value={newsInformation.title}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">News Content</label>
                <textarea
                  className="all_modal_input"
                  placeholder="Content"
                  name="content"
                  type="text"
                  value={newsInformation.content}
                  onChange={handleInputChange}
                  style={{ height: "200px" }}
                  required
                ></textarea>
              </div>
            </div>
            <div>
              <div className="all_modal_label_input">
                <input
                  style={{
                    border: "0",
                    padding: "10px 0px",

                    fontSize: "1em",
                  }}
                  type="file"
                  onChange={(e) => handleUpload(e)}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    height: "45vh",
                    width: "80vh",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {img && (
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={URL.createObjectURL(img)}
                      alt="Selected"
                    />
                  )}
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

export default NewsCreateModal;
