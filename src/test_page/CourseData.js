// import React, { useEffect, useState } from "react";
// import $ from "jquery";
// import Swal from "sweetalert2";
// import {
//   doc,
//   getDocs,
//   getDoc,
//   setDoc,
//   deleteDoc,
//   updateDoc,
//   collection,
//   firestore,
// } from "../firebase";
// import "datatables.net";
// import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
// import "./Course.css";

// function ManageCourseData() {
//   let dataTable;
//   let courses = [];

//   const [courseCodeForUpdate, setcourseCodeForUpdate] = useState(null);
//   const [getManageCreditHour, setManageCreditHour] = useState([]);
//   const [getManageIntakeValues, setManageIntakeValues] = useState([]);
//   const [getManageSelectedIntakeValues, setManageSelectedIntakeValues] =
//     useState([]);
//   const [getManageClassificationValues, setManageClassificationValues] =
//     useState([]);
//   const [getManageGroupValues, setManageGroupValues] = useState(null);
//   const [hasRemarkManage, setManageHasRemark] = useState(false);
//   const [remarkValueManage, setManageRemarkValue] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState({
//     courseCode: "",
//     courseName: "",
//     group: "",
//     creditHours: "",
//     intake: [],
//     classification: [],
//     remark: "",
//     registerStatus: "",
//   });

//   useEffect(() => {
//     dataTable = $("#courseDataTable").DataTable({
//       destroy: true,
//       data: courses,
//       columns: [
//         { data: "courseCode", title: "Course Code" },
//         { data: "courseName", title: "Course Name" },
//         { data: "group", title: "Group" },
//         { data: "creditHours", title: "Credit Hours" },
//         { data: "intake", title: "Intake" },
//         { data: "classification", title: "Classification" },
//         { data: "remark", title: "Remark" },
//         { data: "registerStatus", title: "Register Status" },

//         {
//           data: "id",
//           title: "Manage",
//           render: function (data, type, row) {
//             return `<button class="manageAction">Manage</button>`;
//           },
//         },
//       ],
//     });

//     const fetchData = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(firestore, "course"));
//         courses = [];

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();

//           courses.push({
//             id: doc.id,
//             courseCode: data.course_code,
//             courseName: data.course_name,
//             group: data.group,
//             creditHours: data.credit_hour,
//             intake: data.intake,
//             classification: data.classification,
//             remark: data.remark,
//             registerStatus: data.registerStatus,
//           });
//         });

//         // Update DataTable with the fetched data
//         dataTable.clear().rows.add(courses).draw();
//       } catch (error) {
//         await Swal.fire({
//           icon: "error",
//           title: "Error rejecting data",
//           text: "Please try again.",
//           confirmButtonText: "OK",
//         });
//       }
//     };

//     fetchData();

//     const fetchCreditHour = async () => {
//       try {
//         const credithourCollection = await getDocs(
//           collection(firestore, "course_credit_hours")
//         );
//         const CreditHoursData = credithourCollection.docs.map(
//           (doc) => doc.data().hours
//         );

//         // Sort the array in ascending order
//         const sortedCreditHoursData = CreditHoursData.sort((a, b) => a - b);

//         setManageCreditHour(sortedCreditHoursData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchCreditHour();

//     const fetchIntakeValues = async () => {
//       try {
//         const intakeCollection = await getDocs(collection(firestore, "intake"));
//         const intakeData = intakeCollection.docs.map(
//           (doc) => doc.data().intake
//         );

//         // Convert intake strings to Date objects
//         const dateObjects = intakeData.map((intake) => {
//           const [month, year] = intake.split(" ");
//           const monthIndex = [
//             "January",
//             "February",
//             "March",
//             "April",
//             "May",
//             "June",
//             "July",
//             "August",
//             "September",
//             "October",
//             "November",
//             "December",
//           ].indexOf(month);
//           return new Date(year, monthIndex);
//         });

//         // Sort the Date objects
//         dateObjects.sort((a, b) => a - b);

//         // Convert back to intake format
//         const sortedIntakesData = dateObjects.map((date) => {
//           const month = date.toLocaleString("default", { month: "long" });
//           const year = date.getFullYear();
//           return `${month} ${year}`;
//         });

//         setManageIntakeValues(sortedIntakesData);
//       } catch (error) {
//         console.error("Error fetching checkbox values:", error);
//       }
//     };

//     fetchIntakeValues();

//     $("#courseDataTable").on("click", ".manageAction", manageActionHandler);

//     return () => {
//       $("#courseDataTable").off("click", ".manageAction", manageActionHandler);
//     };
//   }, []);

//   const handleManageClassificationCheckboxChange = (event) => {
//     const { value, checked } = event.target;

//     if (checked) {
//       setManageClassificationValues((prevValues) => [...prevValues, value]);
//     } else {
//       setManageClassificationValues((prevValues) =>
//         prevValues.filter((val) => val !== value)
//       );
//     }
//   };

//   const handleManageIntakeCheckboxChange = (event) => {
//     const { value, checked } = event.target;

//     if (checked) {
//       setManageSelectedIntakeValues((prevValues) => [...prevValues, value]);
//     } else {
//       setManageSelectedIntakeValues((prevValues) =>
//         prevValues.filter((val) => val !== value)
//       );
//     }
//   };

//   const handleManageGroupRadioButtonChange = (event) => {
//     setSelectedCourse({
//       ...selectedCourse,
//       group: event.target.value,
//     });
//   };

//   const handleManageRemarkCheckboxChange = (e) => {
//     setManageHasRemark(e.target.checked);
//     if (!e.target.checked) {
//       setManageRemarkValue("");
//     }
//   };

//   const handleManageRemarkChange = (e) => {
//     setManageRemarkValue(e.target.value);
//   };

//   const handleDataChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedCourse({ ...selectedCourse, [name]: value });
//   };

//   let classificationValues;

//   const manageActionHandler = async function (event) {
//     event.preventDefault();
//     const course_code = $(this).closest("tr").find("td:first-child").text();
//     const course_name = $(this).closest("tr").find("td:nth-child(2)").text();
//     const group = $(this).closest("tr").find("td:nth-child(3)").text();
//     const creditHours = $(this).closest("tr").find("td:nth-child(4)").text();
//     const intake = $(this).closest("tr").find("td:nth-child(5)").text();
//     const classification = $(this).closest("tr").find("td:nth-child(6)").text();
//     const remark = $(this).closest("tr").find("td:nth-child(7)").text();
//     const registerStatus = $(this).closest("tr").find("td:nth-child(8)").text();

//     setSelectedCourse({
//       courseCode: course_code,
//       courseName: course_name,
//       group: group,
//       creditHours: creditHours,
//       intake: intake,
//       classification: classificationValues,
//       remark: remark,
//       registerStatus: registerStatus,
//     });

//     showCourseInformation(
//       course_code,
//       course_name,
//       group,
//       creditHours,
//       intake,
//       classification,
//       remark,
//       registerStatus
//     );
//   };

//   const showCourseInformation = (
//     course_code,
//     course_name,
//     group,
//     creditHours,
//     intake,
//     classification,
//     remark,
//     registerStatus
//   ) => {
//     const modal = $("#managecourseModal");
//     modal.css("display", "flex");

//     // $("#manage_course_code").val(course_code);
//     // $("#manage_course_name").val(course_name);

//     setManageSelectedIntakeValues(intake.split(","));
//     setManageRemarkValue(remark);

//     // Split the classification string into an array of values
//     classificationValues = classification.split(",");

//     // Update the state with the classification values
//     setManageClassificationValues(classificationValues);

//     if (remark !== "none") {
//       setManageHasRemark(true);
//     }
//   };

//   const closeModal = () => {
//     const modal = $("#managecourseModal");
//     modal.css("display", "none");

//     setManageHasRemark(false);
//   };

//   // Hide the modal when clicked outside of it
//   $(window).click(function (event) {
//     const modal = $("#managecourseModal");
//     if (event.target === modal[0]) {
//       modal.css("display", "none");
//       closeModal();
//     }
//   });

//   const updateBtn = async () => {
//     Swal.fire({
//       title: "Updating...",
//       allowOutsideClick: false,
//       showCancelButton: false,
//       showConfirmButton: false,
//       willOpen: () => {
//         Swal.showLoading();
//       },
//     });
//     const courseCode = selectedCourse.courseCode;
//     const courseName = selectedCourse.courseName;
//     const group = selectedCourse.group;
//     const creditHours = selectedCourse.creditHours;
//     const intake = getManageSelectedIntakeValues;
//     const classification = getManageClassificationValues;
//     const remark = remarkValueManage;
//     const registerStatus = selectedCourse.registerStatus;
//     try {
//       // setSelectedCourse((prevState) => ({
//       //   ...prevState,
//       //   intake: getManageSelectedIntakeValues,
//       // }));
//       await updateDoc(doc(firestore, "course", courseCode), {
//         course_code: courseCode,
//         course_name: courseName,
//         group: group,
//         credit_hour: creditHours,
//         intake: intake,
//         classification: classification,
//         remark: remark,
//         registerStatus: registerStatus,
//       });
//       await Swal.fire({
//         icon: "success",
//         title: "Data updated successfully",
//         text: "The course data has been updated.",
//         confirmButtonText: "OK",
//         allowOutsideClick: false,
//       }).then(() => {
//         window.location.reload("/managecourse");
//       });
//       // closeModal();
//     } catch (error) {
//       // console.log(error);
//       await Swal.fire({
//         icon: "error",
//         title: "Error updating data",
//         text: "Error update course: " + error.message + "Please try again.",
//         allowOutsideClick: false,
//       });
//     }
//   };

//   const deleteBtn = async () => {
//     const result = await Swal.fire({
//       title: "Confirm Delete",
//       text: "Do you want to delete?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete!",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       Swal.fire({
//         title: "Deleting...",
//         allowOutsideClick: false,
//         showCancelButton: false,
//         showConfirmButton: false,
//         willOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       const courseCode = selectedCourse.courseCode;
//       try {
//         await deleteDoc(doc(firestore, "course", courseCode));

//         await Swal.fire({
//           icon: "success",
//           title: "Data delete successfully",
//           text: "The course data has been delete.",
//           confirmButtonText: "OK",
//           allowOutsideClick: false,
//         }).then(() => {
//           window.location.reload("/managecourse");
//         });
//       } catch (error) {
//         await Swal.fire({
//           icon: "error",
//           title: "Error delete data",
//           text: "Error delete course: " + error.message + "Please try again.",
//           confirmButtonText: "OK",
//           allowOutsideClick: false,
//         });
//         return;
//       }
//     } else {
//       Swal.close();
//     }
//   };

//   const cancelBtn = () => {
//     closeModal();
//   };

//   return (
//     <div>
//       <div
//         style={{ display: "flex", fontSize: "24px", justifyContent: "center" }}
//       >
//         <div>Course Data</div>
//       </div>
//       <table id="courseDataTable">
//         <thead></thead>
//         <tbody></tbody>
//       </table>

//       {/* Manage Student Modal*/}
//       <div id="managecourseModal" className="manangecourseModal">
//         <div
//           style={{
//             backgroundColor: "cyan",
//             padding: "30px",
//             width: "max-content",
//             borderRadius: "20px",
//             overflow: "auto",
//             height: "50%",
//           }}
//         >
//           <div style={{ fontSize: "26px" }}>Manage Course Information</div>
//           <div>New Course Code</div>
//           <input
//             className="courseinput-group"
//             type="text"
//             placeholder="Course Code"
//             id="manage_course_code"
//             name="courseCode"
//             value={selectedCourse.courseCode}
//             onChange={handleDataChange}
//             readOnly
//           ></input>

//           <label>Select Classification</label>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               marginTop: "10px",
//             }}
//           >
//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   id="classification"
//                   value="SE"
//                   checked={getManageClassificationValues.includes("SE")}
//                   onChange={handleManageClassificationCheckboxChange}
//                 />
//                 SE
//               </label>
//             </div>
//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   id="classification"
//                   value="CN"
//                   checked={getManageClassificationValues.includes("CN")}
//                   onChange={handleManageClassificationCheckboxChange}
//                 />
//                 CN
//               </label>
//             </div>
//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   id="classification"
//                   value="BSD"
//                   checked={getManageClassificationValues.includes("BSD")}
//                   onChange={handleManageClassificationCheckboxChange}
//                 />
//                 BSD
//               </label>
//             </div>
//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   id="classification"
//                   value="Core"
//                   checked={getManageClassificationValues.includes("Core")}
//                   onChange={handleManageClassificationCheckboxChange}
//                 />
//                 Core
//               </label>
//             </div>
//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   id="classification"
//                   value="Elective"
//                   checked={getManageClassificationValues.includes("Elective")}
//                   onChange={handleManageClassificationCheckboxChange}
//                 />
//                 Elective
//               </label>
//             </div>
//           </div>
//           <label>
//             <input
//               type="checkbox"
//               checked={hasRemarkManage}
//               onChange={handleManageRemarkCheckboxChange}
//             />
//             Remark
//           </label>
//           {hasRemarkManage && (
//             <input
//               className="courseinput-group"
//               type="text"
//               placeholder="Remark/Pre-requisite"
//               id="manage_remark"
//               value={remarkValueManage}
//               onChange={handleManageRemarkChange}
//             />
//           )}

//           <div>New Course Name</div>
//           <input
//             className="courseinput-group"
//             type="text"
//             placeholder="Course Name"
//             id="manage_course_name"
//             name="courseName"
//             value={selectedCourse.courseName}
//             onChange={handleDataChange}
//           ></input>

//           <div>Intake</div>
//           <div
//             style={{
//               // backgroundColor: "yellow",
//               height: "180px",
//               width: "300px",
//               overflowY: "auto",
//               marginTop: "10px",
//             }}
//           >
//             {getManageIntakeValues.map((intakeValue) => (
//               <div
//                 style={{
//                   margin: "10px 10px 10px 0px",
//                   width: "max-content",
//                 }}
//                 key={intakeValue}
//               >
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={intakeValue}
//                     checked={getManageSelectedIntakeValues.includes(
//                       intakeValue
//                     )}
//                     onChange={handleManageIntakeCheckboxChange}
//                   />
//                   {intakeValue}
//                 </label>
//               </div>
//             ))}
//           </div>

//           <label>Credit Hour</label>
//           <select
//             className="label-input"
//             id="manage_credit_hour"
//             value={selectedCourse.creditHours}
//             onChange={(e) =>
//               setSelectedCourse({
//                 ...selectedCourse,
//                 creditHours: e.target.value,
//               })
//             }
//             required
//           >
//             <option value="">Select Credit Hour</option>
//             {getManageCreditHour.map((hours) => (
//               <option key={hours} value={hours}>
//                 {hours}
//               </option>
//             ))}
//           </select>

//           <label>Select Group</label>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               marginTop: "10px",
//             }}
//           >
//             <div>
//               <label>
//                 <input
//                   type="radio"
//                   id="manage_groupA"
//                   name="manage_group"
//                   value="GROUP A"
//                   checked={selectedCourse.group.includes("GROUP A")}
//                   onChange={handleManageGroupRadioButtonChange}
//                 />
//                 GROUP A
//               </label>
//             </div>
//             <div>
//               <label>
//                 <input
//                   type="radio"
//                   id="manage_groupB"
//                   name="manage_group"
//                   value="GROUP B"
//                   checked={selectedCourse.group.includes("GROUP B")}
//                   onChange={handleManageGroupRadioButtonChange}
//                 />
//                 GROUP B
//               </label>
//             </div>
//             <div>
//               <label>
//                 <input
//                   type="radio"
//                   id="manage_groupC"
//                   name="manage_group"
//                   value="GROUP C"
//                   checked={selectedCourse.group.includes("GROUP C")}
//                   onChange={handleManageGroupRadioButtonChange}
//                 />
//                 GROUP C
//               </label>
//             </div>
//           </div>
//           <label>
//             <input
//               type="checkbox"
//               id="register_status"
//               checked={selectedCourse.registerStatus === "open"}
//               onChange={(e) =>
//                 setSelectedCourse({
//                   ...selectedCourse,
//                   registerStatus: e.target.checked ? "open" : "close",
//                 })
//               }
//             />
//             Open Register
//           </label>

//           <button type="button" className="managecoursebtn" onClick={updateBtn}>
//             Update
//           </button>
//           <button type="button" className="managecoursebtn" onClick={deleteBtn}>
//             Delete
//           </button>
//           <button
//             type="button"
//             className="manageaccountbtn"
//             onClick={cancelBtn}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageCourseData;
