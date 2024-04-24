import React, { useState, useEffect } from "react";
import {
  storage,
  doc,
  deleteDoc,
  updateDoc,
  collection,
  firestore,
} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";

function NewsManageModal(props) {
  if (!props.open) return null;
  const dataId = props.id;
  const allData = props.allData;
  const [searchNewsData, setSearchNewsData] = useState(null);
  const [newsData, setNewsData] = useState({});
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    const searchInfo = allData.current.find((info) => info.id === dataId);
    setSearchNewsData(searchInfo);

    // console.log(searchRegisterFormData);
    if (searchNewsData) {
      setNewsData({
        title: searchNewsData.title,
        content: searchNewsData.content,
        imgUrl: searchNewsData.imageUrl,
      });
      setImgUrl(searchNewsData.imageUrl);
    }
  }, [allData, dataId, searchNewsData]);
  //   console.log(imgUrl);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsData({ ...newsData, [name]: value });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImg(file);
    setImgUrl(URL.createObjectURL(file));
  };

  const updateBtn = async () => {
    if (newsData.title === "" || newsData.content === "") {
      Swal.fire({
        icon: "error",
        title: "Please fill in all fill",
        text: "Invalid credentials",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
      return;
    }

    if (!img && !imgUrl) {
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

      if (img) {
        // New image selected, upload to Firebase Storage
        const storageRef = ref(storage, `images/${img.name}`);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Track upload progress if needed
          },
          (error) => {
            // Handle unsuccessful uploads
            Swal.fire({
              icon: "error",
              title: "Error updating data",
              text: "Upload error: " + error + " Please try again.",
              allowOutsideClick: false,
            });
          },
          () => {
            // Handle successful uploads
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImgUrl(downloadURL);

              updateDoc(doc(firestore, "news", props.id), {
                title: newsData.title,
                content: newsData.content,
                imageUrl: downloadURL,
              });

              Swal.fire({
                icon: "success",
                title: "Update News successfully",
                text: "News updated.",
                confirmButtonText: "OK",
                allowOutsideClick: false,
              }).then(() => {
                window.location.reload("/news");
              });
            });
          }
        );
      } else {
        // No new image selected, update only text fields
        updateDoc(doc(firestore, "news", props.id), {
          title: newsData.title,
          content: newsData.content,
          imageUrl: imgUrl, // Keep the existing image URL
        });

        Swal.fire({
          icon: "success",
          title: "Update News successfully",
          text: "News updated.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          window.location.reload("/news");
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error creating data",
        text: "Error create form: " + error.message + "Please try again.",
        allowOutsideClick: false,
      });
    }
  };

  const deleteBtn = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Confirm Delete?",
      text: `Do you want to delete ?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting... News",
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await deleteDoc(doc(firestore, "news", props.id));

        Swal.fire({
          icon: "success",
          title: "Delete Successfully",
          text: "News data delete successfully.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          window.location.reload("/news");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error deleting news data",
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
        <div className="all_modal_content_change">
          <div className="all_modal_title">Manage News Data</div>
          <div className="all_modal_subcontent_change">
            <div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">News Title</label>
                <input
                  name="title"
                  placeholder="Title"
                  className="all_modal_input"
                  type="text"
                  value={newsData.title || ""}
                  onChange={handleInputChange}
                  required
                ></input>
              </div>
              <div className="all_modal_label_input">
                <label className="all_modal_label">News Cotent</label>
                <textarea
                  className="all_modal_input"
                  placeholder="Content"
                  name="content"
                  type="text"
                  value={newsData.content || ""}
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
                  {imgUrl && (
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={imgUrl}
                      alt="Selected"
                    />
                  )}
                </div>
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

export default NewsManageModal;
