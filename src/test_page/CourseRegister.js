// import React, { useEffect, useState } from "react";
// import "./CourseRegister.css";
// import Swal from "sweetalert2";
// import $ from "jquery";
// import {
//   doc,
//   addDoc,
//   getDocs,
//   getDoc,
//   setDoc,
//   deleteDoc,
//   where,
//   updateDoc,
//   query,
//   collection,
//   firestore,
// } from "../firebase";

// function CourseRegister() {
//   let noteDefaultValue = `Note 1`;

//   const [selectAllCourse, setSelectAllCourse] = useState(false);

//   const [getCourseName, setCourseName] = useState([]);
//   const [getSelectedCourse, setSelectedCourse] = useState([]);
//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const courseCollection = await getDocs(
//           query(
//             collection(firestore, "course"),
//             where("registerStatus", "==", "open")
//           )
//         );
//         const courseData = courseCollection.docs.map((doc) => {
//           const data = doc.data();
//           const groupInfo =
//             data.group && data.group !== "none" ? ` (${data.group})` : "";

//           return `${data.course_code} ${data.course_name}${groupInfo}`;
//         });

//         setCourseName(courseData);
//       } catch (error) {
//         console.error("Error fetching programmes:", error);
//       }
//     };

//     fetchCourse();
//   }, []);

//   const handlecreateregisterform = async () => {
//     const title = document.getElementById("title").value.trim();
//     const startDate = document.getElementById("startDate").value.trim();
//     const endDate = document.getElementById("endDate").value.trim();
//     const note = document.getElementById("note").value.trim();

//     const selectedRows = $(".rowCheckbox:checked")
//       .map(function () {
//         return dataTable.row($(this).closest("tr")).data();
//       })
//       .toArray();

//     if (getSelectedCourse.length === 0) {
//       Swal.fire({
//         icon: "info",
//         title: "No rows selected",
//         text: "Please select at least one course to create form.",
//         confirmButtonText: "OK",
//       });
//     } else {
//       Swal.fire({
//         title: "Processing",
//         text: "Creating form, please wait...",
//         allowOutsideClick: false,
//         showConfirmButton: false,
//         willOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       await addDoc(collection(firestore, "course_register_form"), {
//         title: title,
//         startDate: startDate,
//         endDate: endDate,
//         note: note,
//         selectedCourses: getSelectedCourse,
//       });

//       // Show success alert
//       await Swal.fire({
//         icon: "success",
//         title: "Create Form successfully",
//         text: "Form created.",
//         confirmButtonText: "OK",
//         allowOutsideClick: false,
//       }).then(() => {
//         window.location.reload("/courseregister");
//       });
//     }
//   };

//   const openAddNewCourseBtn = () => {
//     const modal = $("#createcourseregisterform");
//     modal.css("display", "flex");
//   };

//   const closeModal = () => {
//     const modal = $("#createcourseregisterform");
//     modal.css("display", "none");
//   };

//   // Hide the modal when clicked outside of it
//   $(window).click(function (event) {
//     const modal = $("#createcourseregisterform");
//     if (event.target === modal[0]) {
//       modal.css("display", "none");
//       closeModal();
//     }
//   });

//   const handleCourseCheckboxChange = (event) => {
//     const { value, checked } = event.target;

//     if (checked) {
//       setSelectedCourse((prevValues) => [...prevValues, value]);
//     } else {
//       setSelectedCourse((prevValues) =>
//         prevValues.filter((val) => val !== value)
//       );
//     }
//   };

//   const handleSelectAllChange = (event) => {
//     const { checked } = event.target;
//     setSelectAllCourse(checked);
//     setSelectedCourse(checked ? getCourseName : []);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <button
//         type="button"
//         className="openModalbtn"
//         id="login"
//         onClick={openAddNewCourseBtn}
//       >
//         Create Register Form
//       </button>

//       <div id="createcourseregisterform">
//         <div className="createcourseregisterformcontent">
//           <div
//             style={{
//               // padding: "20px",
//               fontSize: "24px",
//               textDecoration: "underline",
//               fontWeight: "bold",
//             }}
//           >
//             Create New Registration Form
//           </div>
//           <div style={{ display: "flex" }}>
//             <div>
//               <div>
//                 Register Form Title
//                 <input
//                   className="courseinput-group"
//                   type="text"
//                   placeholder="Title"
//                   name="title"
//                   id="title"
//                 ></input>
//               </div>

//               <label className="eventmodallabelInput">
//                 Start Date:
//                 <input
//                   type="date"
//                   name="startDate"
//                   id="startDate"
//                   className="modallabelInput"
//                 />
//               </label>
//               <label className="eventmodallabelInput">
//                 End Date:
//                 <input
//                   type="date"
//                   name="endDate"
//                   id="endDate"
//                   className="modallabelInput"
//                 />
//               </label>
//               <div>
//                 Important Note
//                 <textarea
//                   className="courseinput-group"
//                   placeholder="Note"
//                   id="note"
//                   name="note"
//                   defaultValue={noteDefaultValue}
//                   style={{ height: "200px" }}
//                 ></textarea>
//               </div>
//             </div>
//             <div className="course-register-table">
//               <div>Course is open</div>
//               <div
//                 style={{
//                   // backgroundColor: "yellow",
//                   height: "60vh",
//                   overflow: "hidden",
//                   overflowY: "auto",
//                   marginTop: "10px",
//                 }}
//               >
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={selectAllCourse}
//                     onChange={handleSelectAllChange}
//                   />
//                   Select All Courses
//                 </label>
//                 {getCourseName.map((courseValue) => (
//                   <div
//                     style={{
//                       margin: "10px 10px 10px 0px",
//                       width: "max-content",
//                     }}
//                     key={courseValue}
//                   >
//                     <label>
//                       <input
//                         type="checkbox"
//                         value={courseValue}
//                         checked={getSelectedCourse.includes(courseValue)}
//                         onChange={handleCourseCheckboxChange}
//                       />
//                       {courseValue}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <button onClick={handlecreateregisterform}>
//             Create Register Form
//           </button>
//           <button onClick={closeModal}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CourseRegister;
