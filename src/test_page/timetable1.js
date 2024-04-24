// import React, { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import { ChromePicker } from "react-color";
// import {
//   doc,
//   getDocs,
//   getDoc,
//   setDoc,
//   query,
//   addDoc,
//   deleteDoc,
//   collection,
//   where,
//   firestore,
// } from "../firebase";
// import $, { data } from "jquery";
// import "./CreateCourseTimetable.css";
// import Swal from "sweetalert2";

// const CreateCourseTimetable = () => {
//   const [events, setEvents] = useState([]);
//   const [eventColor, setEventColor] = useState("#3788d8"); // Initial color
//   const [courseDetails, setCourseDetails] = useState({
//     courseCode: "",
//     dayOfWeek: "",
//     startDate: "",
//     endDate: "",
//     startTime: "",
//     endTime: "",
//     lecturer: "",
//     class: "",
//   });

//   const [updatecourseDetails, setupdatecourseDetails] = useState({
//     courseCode: "",
//     dayOfWeek: "",
//     startDate: "",
//     endDate: "",
//     startTime: "",
//     endTime: "",
//     class: "",
//     lecturer: "",
//     studentAmount: "",
//     eventColor: "",
//   });

//   const [updateCourse, setupdateCourse] = useState(null);
//   const [getCourseData, setCourseData] = useState([]);
//   useEffect(() => {
//     const fetchEvents = async () => {
//       Swal.fire({
//         title: "Loading...",
//         allowOutsideClick: false,
//         showCancelButton: false,
//         showConfirmButton: false,
//         willOpen: () => {
//           Swal.showLoading();
//         },
//       });
//       try {
//         const coursesCollection = collection(firestore, "course_timetable");
//         const snapshot = await getDocs(coursesCollection);
//         const eventsData = await Promise.all(
//           snapshot.docs.map(async (doc) => {
//             const course = doc.data();

//             // const studentAmount = course.studentAmount;
//             // // console.log(studentAmount);
//             // const counts = studentAmount.split(", ");

//             // // Calculate the total number of students
//             // const totalStudents = counts.reduce(
//             //   (total, count) => total + parseInt(count),
//             //   0
//             // );

//             // // Format the result as (1+3)4
//             // const formattedstudentAmount = `(${counts.join(
//             //   "+"
//             // )})${totalStudents}`;
//             const studentAmount = course.studentAmount;
//             const counts = studentAmount.split(", ");

//             let formattedStudentAmount;
//             if (counts.length === 1) {
//               formattedStudentAmount = `(${counts[0]})`;
//             } else {
//               const totalStudents = counts.reduce(
//                 (total, count) => total + parseInt(count),
//                 0
//               );
//               formattedStudentAmount = `(${counts.join("+")})${totalStudents}`;
//             }

//             // console.log(formattedstudentAmount);

//             const dayOfWeek = parseInt(course.dayOfWeek, 10);
//             const start = new Date(course.startDate);
//             const end = new Date(course.endDate);
//             const dates = [];
//             let current = new Date(start);

//             let dayOfWeekFormatted;
//             switch (dayOfWeek) {
//               case 1:
//                 dayOfWeekFormatted = "Monday";
//                 break;
//               case 2:
//                 dayOfWeekFormatted = "Tuesday";
//                 break;
//               case 3:
//                 dayOfWeekFormatted = "Wednesday";
//                 break;
//               case 4:
//                 dayOfWeekFormatted = "Thursday";
//                 break;
//               case 5:
//                 dayOfWeekFormatted = "Friday";
//                 break;
//               case 6:
//                 dayOfWeekFormatted = "Saturday";
//                 break;
//               case 0:
//                 dayOfWeekFormatted = "Sunday";
//                 break;
//               default:
//                 dayOfWeekFormatted = "";
//             }

//             while (current <= end) {
//               if (current.getDay() === dayOfWeek) {
//                 dates.push(new Date(current));
//               }
//               current.setDate(current.getDate() + 1);
//             }

//             const newEvents = await Promise.all(
//               dates.map(async (date) => {
//                 const startTime = new Date(
//                   `${date.toDateString()} ${course.startTime}`
//                 );
//                 const endTime = new Date(
//                   `${date.toDateString()} ${course.endTime}`
//                 );

//                 const startDateString = start.toLocaleDateString("en-GB");
//                 const endDateString = end.toLocaleDateString("en-GB");
//                 const startTimeString = startTime.toLocaleTimeString("en-US", {
//                   hour: "numeric",
//                   minute: "2-digit",
//                 });
//                 const endTimeString = endTime.toLocaleTimeString("en-US", {
//                   hour: "numeric",
//                   minute: "2-digit",
//                 });

//                 return {
//                   // color: "green",
//                   title: `${course.courseCode} ${formattedStudentAmount}, ${course.lecturer}, ${startTimeString} - ${endTimeString}, <${course.class}>, [${dayOfWeekFormatted}, ${startDateString} - ${endDateString}]`,
//                   start: startTime,
//                   end: endTime,
//                   backgroundColor: course.eventColor,
//                 };
//               })
//             );

//             return newEvents;
//           })
//         );

//         setEvents(eventsData.flat());

//         Swal.close();
//       } catch (error) {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: error.message,
//           allowOutsideClick: false,
//           confirmButtonText: "OK",
//         });
//         return;
//       }
//     };

//     fetchEvents();

//     const fetchCourse = async () => {
//       try {
//         const courseCollection = await getDocs(collection(firestore, "course"));
//         const courseData = courseCollection.docs.map((doc) => {
//           const data = doc.data();
//           const groupInfo =
//             data.group && data.group !== "none" ? ` (${data.group})` : "";

//           return `${data.course_code} ${data.course_name}${groupInfo}`;
//         });

//         setCourseData(courseData);
//       } catch (error) {
//         console.error("Error fetching programmes:", error);
//       }
//     };

//     fetchCourse();
//   }, []);

//   let intakeStudentCounts = {};

//   const handleEventAdd = (e) => {
//     const { name, value } = e.target;
//     setCourseDetails({ ...courseDetails, [name]: value });
//   };

//   const handleEventChange = (e) => {
//     const { name, value } = e.target;
//     setupdatecourseDetails({ ...updatecourseDetails, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(firestore, "course_timetable"), {
//         courseCode: courseDetails.courseCode,
//         startDate: courseDetails.startDate,
//         endDate: courseDetails.endDate,
//         startTime: courseDetails.startTime,
//         endTime: courseDetails.endTime,
//         studentAmount: getstudentNumber,
//         lecturer: courseDetails.lecturer,
//         class: courseDetails.class,
//         dayOfWeek: courseDetails.dayOfWeek,
//         eventColor: eventColor,
//       });

//       window.location.reload("/createcoursetimetable");

//       console.log("success");
//     } catch (error) {
//       console.log(error);
//     }

//     // setCourseDetails({
//     //   courseCode: "", // Assuming you have added courseCode to your state
//     //   dayOfWeek: "",
//     //   startDate: "",
//     //   endDate: "",
//     //   startTime: "",
//     //   endTime: "",
//     //   lecturer: "",
//     //   class: "",
//     // });
//   };

//   const handleUpdate = async () => {
//     // Delete existing data
//     const newupdateCourse = updateCourse.courseCode;
//     const newdayOfWeek = updateCourse.dayOfWeek;
//     const newupdateStartDate = updateCourse.startDate;
//     const newupdateEndDate = updateCourse.endDate;
//     const newupdateStartTime = updateCourse.startTime;
//     const newupdateEndTime = updateCourse.endTime;
//     const newupdateClass = updateCourse.class;
//     const newupdateLecturer = updateCourse.lecturer;
//     // const newupdateeventColor = updateCourse.eventColor;
//     // console.log("Course" + newupdateCourse);
//     // console.log("Week" + newdayOfWeek);
//     // console.log("Start Date" + newupdateStartDate);
//     // console.log("End Date" + newupdateEndDate);
//     // console.log("Start Time" + newupdateStartTime);
//     // console.log("End Time" + newupdateEndTime);
//     // console.log(getNewEventColor); //new
//     // console.log(getNewUpdateEventColor); //old
//     try {
//       const querySnapshot = await getDocs(
//         query(
//           collection(firestore, "course_timetable"),
//           where("courseCode", "==", newupdateCourse),
//           where("dayOfWeek", "==", newdayOfWeek),
//           where("startDate", "==", newupdateStartDate),
//           where("endDate", "==", newupdateEndDate),
//           where("startTime", "==", newupdateStartTime),
//           where("endTime", "==", newupdateEndTime),
//           where("class", "==", newupdateClass),
//           where("lecturer", "==", newupdateLecturer),
//           where("eventColor", "==", getNewUpdateEventColor)
//         )
//       );

//       querySnapshot.docs.forEach(async (doc) => {
//         // console.log(doc.id);
//         await deleteDoc(doc.ref);
//       });

//       await addDoc(collection(firestore, "course_timetable"), {
//         courseCode: updatecourseDetails.courseCode,
//         dayOfWeek: updatecourseDetails.dayOfWeek,
//         startDate: updatecourseDetails.startDate,
//         endDate: updatecourseDetails.endDate,
//         startTime: updatecourseDetails.startTime,
//         endTime: updatecourseDetails.endTime,
//         class: updatecourseDetails.class,
//         lecturer: updatecourseDetails.lecturer,
//         studentAmount: getstudentNumber,
//         eventColor: getNewEventColor,
//       });

//       window.location.reload("/createcoursetimetable");

//       console.log("success update");
//     } catch (error) {
//       console.log(error);
//     }

//     // Close the modal or perform any other actions after updating
//   };
//   const [getStudentAmount, setStudentAmount] = useState([]);
//   const [getstudentTotalNumber, setStudentTotalNumber] = useState("");
//   const handleDelete = async () => {
//     const newupdateCourse = updateCourse.courseCode;
//     const newdayOfWeek = updateCourse.dayOfWeek;
//     const newupdateStartDate = updateCourse.startDate;
//     const newupdateEndDate = updateCourse.endDate;
//     const newupdateStartTime = updateCourse.startTime;
//     const newupdateEndTime = updateCourse.endTime;
//     const newupdateClass = updateCourse.class;
//     const newupdateLecturer = updateCourse.lecturer;
//     // const newupdateeventColor = updateCourse.eventColor;

//     try {
//       const querySnapshot = await getDocs(
//         query(
//           collection(firestore, "course_timetable"),
//           where("courseCode", "==", newupdateCourse),
//           where("dayOfWeek", "==", newdayOfWeek),
//           where("startDate", "==", newupdateStartDate),
//           where("endDate", "==", newupdateEndDate),
//           where("startTime", "==", newupdateStartTime),
//           where("endTime", "==", newupdateEndTime),
//           where("class", "==", newupdateClass),
//           where("lecturer", "==", newupdateLecturer),
//           where("eventColor", "==", getNewUpdateEventColor)
//         )
//       );

//       const deletePromises = querySnapshot.docs.map(async (doc) => {
//         await deleteDoc(doc.ref);
//       });

//       await Promise.all(deletePromises);

//       window.location.reload("/createcoursetimetable");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Add Course Modal

//   const openAddCourseModal = () => {
//     const modal = $("#addcoursemodal");
//     modal.css("display", "flex");
//   };

//   const closeAddCourseModal = () => {
//     const modal = $("#addcoursemodal");
//     modal.css("display", "none");

//     setCourseDetails({
//       courseCode: "", // Assuming you have added courseCode to your state
//       dayOfWeek: "",
//       startDate: "",
//       endDate: "",
//       startTime: "",
//       endTime: "",
//       lecturer: "",
//       class: "",
//     });

//     setStudentAmount([]);
//     setStudentTotalNumber("");
//   };

//   // Hide the modal when clicked outside of it
//   $(window).click(function (event) {
//     const modal = $("#addcoursemodal");
//     if (event.target === modal[0]) {
//       modal.css("display", "none");
//       closeAddCourseModal();
//     }
//   });

//   // Event Modal
//   const [getNewEventColor, setNewEventColor] = useState("");
//   const [getNewUpdateEventColor, setNewUpdateEventColor] = useState("");
//   const handleEventClick = async (eventClickInfo) => {
//     const eventmodal = $("#eventmodal");
//     eventmodal.css("display", "flex");

//     const eventData = eventClickInfo.event.title;

//     const data = eventData;

//     // Split the data
//     const splitData = data.split(", ");

//     const courseData = splitData[0];

//     const parenIndex = courseData.lastIndexOf("(");

//     // Extract the course code and title
//     const course = courseData.slice(0, parenIndex).trim();
//     // Extract the additional information
//     const studentAmount = courseData.slice(parenIndex).trim();

//     const lecturer = splitData[1];
//     const durationTime = splitData[2].split(" - "); // Splitting durationTime by " - "
//     const location = splitData[3].replace(/[<>]/g, ""); // Removing angle brackets from location
//     let weekly = splitData[4]; // Using let to reassign the variable
//     const durationDate = splitData[5].split(" - "); // Splitting durationDate by " - "

//     // Extract start time and end time
//     const startTime = durationTime[0];
//     const endTime = durationTime[1];

//     // Extract start date and end date
//     const startDate = durationDate[0]; // Removing the opening bracket from start date
//     const endDate = durationDate[1].substring(0, durationDate[1].length - 1); // Removing the closing bracket from end date

//     // Remove brackets from weekly
//     weekly = weekly.substring(1, weekly.length);

//     let weeklyFormatted;

//     switch (weekly) {
//       case "Monday":
//         weeklyFormatted = "1";
//         break;
//       case "Tuesday":
//         weeklyFormatted = "2";
//         break;
//       case "Wednesday":
//         weeklyFormatted = "3";
//         break;
//       case "Thursday":
//         weeklyFormatted = "4";
//         break;
//       case "Friday":
//         weeklyFormatted = "5";
//         break;
//       case "Saturday":
//         weeklyFormatted = "6";
//         break;
//       case "Sunday":
//         weeklyFormatted = "0";
//         break;
//       default:
//         weeklyFormatted = "";
//     }

//     // Function to format date
//     const formatDate = (date) => {
//       const [day, month, year] = date.split("/");
//       return `${year}-${month}-${day}`;
//     };

//     // Format start date and end date
//     const formattedStartDate = formatDate(startDate);
//     const formattedEndDate = formatDate(endDate);

//     const formatTime = (time) => {
//       let [hour, minutes] = time.split(":").map((part) => part.trim());
//       const period = minutes.split(" ")[1]; // Get the period (AM or PM)
//       minutes = minutes.split(" ")[0]; // Remove the period from minutes

//       // Convert hour to 24-hour format
//       hour = period === "AM" && hour === "12" ? "00" : hour;
//       hour =
//         period === "PM" && hour !== "12"
//           ? String(parseInt(hour, 10) + 12)
//           : hour;

//       // Add leading zero if hour is a single digit
//       hour = hour.length === 1 ? "0" + hour : hour;

//       return `${hour}:${minutes}`;
//     };

//     // console.log(studentAmount);
//     // console.log("Lecturer:", lecturer);
//     // console.log("Location:", location);

//     const formattedStartTime = formatTime(startTime);
//     const formattedEndTime = formatTime(endTime);

//     // console.log(course);
//     // console.log(weeklyFormatted);
//     // console.log(formattedStartDate);
//     // console.log(formattedEndDate);
//     // console.log(formattedStartTime);
//     // console.log(formattedEndTime);
//     // console.log(location);
//     // console.log(lecturer);

//     try {
//       const querySnapshot = await getDocs(
//         query(
//           collection(firestore, "course_timetable"),
//           where("courseCode", "==", course),
//           where("dayOfWeek", "==", weeklyFormatted),
//           where("startDate", "==", formattedStartDate),
//           where("endDate", "==", formattedEndDate),
//           where("startTime", "==", formattedStartTime),
//           where("endTime", "==", formattedEndTime),
//           where("class", "==", location),
//           where("lecturer", "==", lecturer)
//         )
//       );

//       querySnapshot.docs.forEach(async (doc) => {
//         const eventColorData = doc.data().eventColor;
//         setNewEventColor(eventColorData);
//         // await deleteDoc(doc.ref);
//         setNewUpdateEventColor(eventColorData);
//       });
//     } catch (error) {
//       console.log(error);
//     }

//     setupdatecourseDetails({
//       courseCode: course,
//       dayOfWeek: weeklyFormatted,
//       startDate: formattedStartDate,
//       endDate: formattedEndDate,
//       startTime: formattedStartTime,
//       endTime: formattedEndTime,
//       class: location,
//       lecturer: lecturer,
//       eventColor: getNewEventColor,
//     });

//     setupdateCourse({
//       courseCode: course,
//       dayOfWeek: weeklyFormatted,
//       startDate: formattedStartDate,
//       endDate: formattedEndDate,
//       startTime: formattedStartTime,
//       endTime: formattedEndTime,
//       class: location,
//       lecturer: lecturer,
//       eventColor: getNewEventColor,
//     });
//   };

//   const closeEventModal = () => {
//     const modal = $("#eventmodal");
//     modal.css("display", "none");
//   };

//   // Hide the modal when clicked outside of it
//   $(window).click(function (event) {
//     const modal = $("#eventmodal");
//     if (event.target === modal[0]) {
//       modal.css("display", "none");
//       closeEventModal();
//     }
//   });

//   const [tooltipElement, setTooltipElement] = useState("");
//   const handleEventMouseEnter = (info) => {
//     // console.log(info.event.title);
//     const tooltipContent = info.event.title;

//     // Create a div element for the tooltip
//     const tooltip = document.createElement("div");
//     tooltip.classList.add("tooltip");

//     tooltip.textContent = tooltipContent;

//     // Position the tooltip
//     tooltip.style.position = "absolute";
//     tooltip.style.backgroundColor = "#f7f7f7";
//     // tooltip.style.top = `${info.jsEvent.clientY}px`;
//     // tooltip.style.left = `${info.jsEvent.clientX}px`;
//     tooltip.style.fontSize = "16px";
//     tooltip.style.display = "block";
//     tooltip.style.zIndex = "1000"; // or any higher value
//     tooltip.style.pointerEvents = "none";
//     tooltip.style.width = "380px";
//     tooltip.style.color = "black";
//     // tooltip.style.backgroundColor = "#ffff40";
//     tooltip.style.border = "1px solid black";
//     tooltip.style.padding = "10px";
//     tooltip.style.borderRadius = "10px";

//     // Calculate the position of the event relative to the tooltip
//     const eventRect = info.el.getBoundingClientRect();
//     const tooltipRect = tooltip.getBoundingClientRect();
//     // const offsetLeft =
//     //   eventRect.left + eventRect.width / 2 - tooltipRect.width / 2;
//     // const offsetTop = eventRect.top + eventRect.height;

//     const offsetLeft = eventRect.left - tooltipRect.width - 150;
//     const offsetTop = eventRect.top - eventRect.width / 2;

//     // Set the position of the tooltip
//     tooltip.style.left = `${offsetLeft}px`;
//     tooltip.style.top = `${offsetTop}px`;

//     // Append the tooltip to the body
//     document.body.appendChild(tooltip);

//     // Store the tooltip element in state to remove it later
//     setTooltipElement(tooltip);
//   };

//   const handleEventMouseLeave = () => {
//     // Remove the tooltip from the body
//     if (tooltipElement) {
//       tooltipElement.remove();
//       setTooltipElement(null);
//     }
//   };

//   const [getstudentNumber, setStudentNumber] = useState("");

//   const checkIntake = async (selectedCourse) => {
//     const courseString = selectedCourse;
//     const parts = courseString.split(" ");
//     const courseCode = parts[0]; // "TCS3064"
//     // console.log("Course Code:", courseCode);

//     try {
//       const courseCollection = await getDoc(
//         doc(firestore, "course", courseCode)
//       );
//       const courseData = courseCollection.data();
//       const courseIntake = courseData.intake;
//       console.log(courseIntake);

//       const studentDataCollection = collection(firestore, "student_data");

//       let amount = [];
//       let totalNumberOfStudents = 0;

//       for (const intakeValue of courseIntake) {
//         const q = query(
//           studentDataCollection,
//           where("intake", "==", intakeValue)
//         );

//         const snapshot = await getDocs(q);
//         const numberOfStudents = snapshot.size;

//         amount.push(
//           `Number of students for ${intakeValue}: ${numberOfStudents}`
//         );
//         intakeStudentCounts[intakeValue] = numberOfStudents;
//         totalNumberOfStudents += numberOfStudents;
//       }

//       setStudentAmount(amount);
//       setStudentTotalNumber(
//         "The total number of students in this course is " +
//           totalNumberOfStudents
//       );
//       console.log(getStudentAmount);
//       console.log(`Total number of students: ${totalNumberOfStudents}`);
//       setStudentNumber(Object.values(intakeStudentCounts).join(", "));
//     } catch (error) {
//       console.error("Error checking intake:", error);
//     }
//   };

//   const checkIntakeData = async (test) => {
//     const courseString = test;
//     const parts = courseString.split(" ");
//     const courseCode = parts[0]; // "TCS3064"
//     // console.log("Course Code:", courseCode);

//     try {
//       const courseCollection = await getDoc(
//         doc(firestore, "course", courseCode)
//       );
//       const courseData = courseCollection.data();
//       const courseIntake = courseData.intake;
//       // console.log(courseIntake);

//       const studentDataCollection = collection(firestore, "student_data");

//       let amount = [];
//       let totalNumberOfStudents = 0;

//       for (const intakeValue of courseIntake) {
//         const q = query(
//           studentDataCollection,
//           where("intake", "==", intakeValue)
//         );

//         const snapshot = await getDocs(q);
//         const numberOfStudents = snapshot.size;

//         amount.push(
//           `Number of students for ${intakeValue}: ${numberOfStudents}`
//         );
//         intakeStudentCounts[intakeValue] = numberOfStudents;
//         totalNumberOfStudents += numberOfStudents;
//       }

//       setStudentAmount(amount);
//       setStudentTotalNumber(
//         "The total number of students in this course is " +
//           totalNumberOfStudents
//       );
//       // console.log(`Total number of students: ${totalNumberOfStudents}`);
//       setStudentNumber(Object.values(intakeStudentCounts).join(", "));
//     } catch (error) {
//       // console.error("Error checking intake:", error);
//     }
//   };

//   const test = updatecourseDetails.courseCode;
//   checkIntakeData(test);
//   // console.log(test);

//   // Call checkIntake with the selected course when it changes
//   const handleCourseSelect = (e) => {
//     const selectedCourse = e.target.value;
//     checkIntake(selectedCourse);
//   };

//   return (
//     <div
//       style={{
//         padding: "20px",
//       }}
//     >
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin]}
//         initialView="timeGridWeek"
//         // weekends={false}
//         // slotDuration="01:00:00"
//         // slotLabelInterval="01:00"
//         slotLabelFormat={{ hour: "numeric", minute: "2-digit" }}
//         // dayHeaderFormat={{ weekday: "long" }}
//         contentHeight="auto"
//         height="parent"
//         events={events}
//         allDaySlot={false}
//         slotMinTime="06:00:00" // Display from 8am
//         slotMaxTime="21:00:00" // Display until 6pm
//         headerToolbar={{
//           left: "today addCourseTimeButton prev,next",
//           center: "title",
//           right: "dayGridMonth,timeGridWeek,timeGridDay",
//         }}
//         customButtons={{
//           addCourseTimeButton: {
//             text: "Add Course Time",
//             click: function () {
//               openAddCourseModal();
//             },
//           },
//         }}
//         eventClick={handleEventClick}
//         // eventContent={eventContent}
//         eventMouseEnter={handleEventMouseEnter}
//         eventMouseLeave={handleEventMouseLeave}
//       />

//       {/* Event Modal*/}
//       <div id="eventmodal" className="eventmodal">
//         <div className="modalContent">
//           <div
//             style={{
//               padding: "20px",
//               fontSize: "24px",
//               textDecoration: "underline",
//               fontWeight: "bold",
//             }}
//           >
//             Manage Course Time
//           </div>

//           <div
//             style={{
//               display: "flex",
//               // justifyContent: "space-evenly",
//             }}
//           >
//             <div
//               style={{
//                 padding: "20px",
//                 display: "flex",
//                 flexDirection: "column",
//                 // width: "300px",
//               }}
//             >
//               <label className="eventmodallabelInput">
//                 Event Color:
//                 <ChromePicker
//                   color={getNewEventColor}
//                   onChange={(color) => setNewEventColor(color.hex)}
//                 />
//               </label>
//             </div>
//             <div
//               style={{
//                 padding: "20px",
//                 display: "flex",
//                 flexDirection: "column",
//                 // width: "300px",
//               }}
//             >
//               <label className="eventmodallabelInput">
//                 Course
//                 <select
//                   // className="label-input"
//                   name="courseCode"
//                   value={updatecourseDetails.courseCode}
//                   className="modallabelInput"
//                   onChange={(e) => {
//                     handleEventChange(e);
//                     handleCourseSelect(e);
//                   }}
//                   required
//                 >
//                   <option value="">Select Course</option>
//                   {getCourseData.map((course) => (
//                     <option key={course} value={course}>
//                       {course}
//                     </option>
//                   ))}
//                 </select>
//               </label>

//               <div style={{ backgroundColor: "yellow" }}>
//                 {updatecourseDetails.courseCode && (
//                   <>
//                     <div>Student Amount</div>
//                     {getStudentAmount.map((amount) => (
//                       <div key={amount}>{amount}</div>
//                     ))}
//                     {getstudentTotalNumber}
//                   </>
//                 )}
//               </div>
//               <label className="eventmodallabelInput">
//                 Lecturer:
//                 <input
//                   type="text"
//                   name="lecturer"
//                   value={updatecourseDetails.lecturer}
//                   onChange={handleEventChange}
//                 />
//               </label>
//               <label className="eventmodallabelInput">
//                 Classroom:
//                 <input
//                   type="text"
//                   name="class"
//                   value={updatecourseDetails.class}
//                   onChange={handleEventChange}
//                 />
//               </label>
//             </div>

//             <div
//               style={{
//                 padding: "20px",
//                 display: "flex",
//                 flexDirection: "column",
//                 // width: "300px",
//               }}
//             >
//               <label className="eventmodallabelInput">
//                 Day of the Week:
//                 <select
//                   name="dayOfWeek"
//                   value={updatecourseDetails.dayOfWeek}
//                   onChange={handleEventChange}
//                   className="modallabelInput"
//                 >
//                   <option value="">Select Day</option>
//                   <option value="1">Monday</option>
//                   <option value="2">Tuesday</option>
//                   <option value="3">Wednesday</option>
//                   <option value="4">Thursday</option>
//                   <option value="5">Friday</option>
//                   <option value="6">Saturday</option>
//                   <option value="0">Sunday</option>
//                 </select>
//               </label>
//               <label className="eventmodallabelInput">
//                 Start Date:
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={updatecourseDetails.startDate}
//                   onChange={handleEventChange}
//                   className="modallabelInput"
//                 />
//               </label>
//               <label className="eventmodallabelInput">
//                 End Date:
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={updatecourseDetails.endDate}
//                   onChange={handleEventChange}
//                   className="modallabelInput"
//                 />
//               </label>
//               {/* <label className="eventmodallabelInput">
//                 Start Time:
//                 <input
//                   type="time"
//                   name="startTime"
//                   value={updatecourseDetails.startTime}
//                   onChange={handleEventChange}
//                   className="modallabelInput"
//                 />
//               </label> */}
//               <label className="eventmodallabelInput">
//                 Start Time:
//                 <select
//                   name="startTime"
//                   value={updatecourseDetails.startTime}
//                   onChange={handleEventChange}
//                   className="modallabelInput"
//                 >
//                   <option value="">Select Time</option>
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour}>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >{`${hour.toString().padStart(2, "0")}:00 AM`}</option>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:30`}
//                       >{`${hour.toString().padStart(2, "0")}:30 AM`}</option>
//                     </React.Fragment>
//                   ))}
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour + 12}>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:00`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:00 PM`}</option>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:30`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:30 PM`}</option>
//                     </React.Fragment>
//                   ))}
//                 </select>
//               </label>
//               {/* <label className="eventmodallabelInput">
//                 End Time:
//                 <input
//                   type="time"
//                   name="endTime"
//                   value={updatecourseDetails.c}
//                   onChange={handleEventChange}
//                   className="modallabelInput"
//                 />
//               </label> */}
//               <label className="eventmodallabelInput">
//                 End Time:
//                 <select
//                   name="endTime"
//                   value={updatecourseDetails.endTime}
//                   onChange={handleEventChange}
//                   className="modallabelInput"
//                 >
//                   <option value="">Select Time</option>
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour}>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >{`${hour.toString().padStart(2, "0")}:00 AM`}</option>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:30`}
//                       >{`${hour.toString().padStart(2, "0")}:30 AM`}</option>
//                     </React.Fragment>
//                   ))}
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour + 12}>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:00`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:00 PM`}</option>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:30`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:30 PM`}</option>
//                     </React.Fragment>
//                   ))}
//                   {/* {[...Array(25).keys()].map((hour) => (
//                     <React.Fragment key={hour}>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >{`${hour.toString().padStart(2, "0")}:00`}</option>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:30`}
//                       >{`${hour.toString().padStart(2, "0")}:30`}</option>
//                     </React.Fragment>
//                   ))} */}
//                   {/* {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour}>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:00 AM`}
//                       >{`${hour.toString().padStart(2, "0")}:00 AM`}</option>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:30 AM`}
//                       >{`${hour.toString().padStart(2, "0")}:30 AM`}</option>
//                     </React.Fragment>
//                   ))}
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour + 12}>
//                       <option
//                         value={`${(hour + 12)
//                           .toString()
//                           .padStart(2, "0")}:00 PM`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:00 PM`}</option>
//                       <option
//                         value={`${(hour + 12)
//                           .toString()
//                           .padStart(2, "0")}:30 PM`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:30 PM`}</option>
//                     </React.Fragment>
//                   ))} */}
//                 </select>
//               </label>
//             </div>
//           </div>
//           <div
//             style={{
//               width: "100%",
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "center",
//               marginTop: "20px",
//             }}
//           >
//             <button onClick={handleUpdate} className="addcourseBtn">
//               Update
//             </button>
//             <button onClick={handleDelete} className="deletecourseBtn">
//               Delete
//             </button>
//             <button onClick={closeEventModal} className="closecoursemodalBtn">
//               Close
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add Course Modal*/}
//       <div id="addcoursemodal" className="addcoursemodal">
//         <div className="modalContent">
//           <div
//             style={{
//               padding: "20px",
//               fontSize: "24px",
//               textDecoration: "underline",
//               fontWeight: "bold",
//             }}
//           >
//             Add New Course Time
//           </div>
//           <div
//             style={{
//               display: "flex",
//               // justifyContent: "space-evenly",
//             }}
//           >
//             <div
//               style={{
//                 padding: "20px",
//                 display: "flex",
//                 flexDirection: "column",
//                 // width: "300px",
//               }}
//             >
//               <label className="eventmodallabelInput">
//                 Event Color:
//                 <ChromePicker
//                   color={eventColor}
//                   onChange={(color) => setEventColor(color.hex)}
//                 />
//               </label>
//             </div>
//             <div
//               style={{
//                 padding: "20px",
//                 display: "flex",
//                 flexDirection: "column",
//                 // width: "300px",
//               }}
//             >
//               {/* <label>
//                 Course:
//                 <input
//                   type="text"
//                   name="courseCode"
//                   value={courseDetails.courseCode}
//                   onChange={handleEventAdd}
//                 />
//               </label> */}
//               <label className="eventmodallabelInput">
//                 Course:
//                 <select
//                   id="courseCode"
//                   name="courseCode"
//                   value={courseDetails.courseCode}
//                   className="modallabelInput"
//                   onChange={(e) => {
//                     handleEventAdd(e);
//                     handleCourseSelect(e);
//                   }}
//                   required
//                 >
//                   <option value="">Select Course</option>
//                   {getCourseData.map((course) => (
//                     <option key={course} value={course}>
//                       {course}
//                     </option>
//                   ))}
//                 </select>
//               </label>

//               {/* <div style={{ backgroundColor: "yellow" }}>
//                 <div>Student Amount</div>
//                 {studentAmount.map((amount) => (
//                   <div key={amount}>{amount}</div>
//                 ))}
//               </div> */}
//               <div style={{ backgroundColor: "yellow" }}>
//                 {courseDetails.courseCode && (
//                   <>
//                     <div>Student Amount</div>
//                     {getStudentAmount.map((amount) => (
//                       <div key={amount}>{amount}</div>
//                     ))}
//                     {getstudentTotalNumber}
//                   </>
//                 )}
//               </div>

//               <label className="eventmodallabelInput">
//                 Lecturer
//                 <input
//                   type="text"
//                   name="lecturer"
//                   value={courseDetails.lecturer}
//                   onChange={handleEventAdd}
//                 />
//               </label>
//               <label className="eventmodallabelInput">
//                 Class
//                 <input
//                   type="text"
//                   name="class"
//                   value={courseDetails.class}
//                   onChange={handleEventAdd}
//                 />
//               </label>
//             </div>
//             <div
//               style={{
//                 padding: "20px",
//                 display: "flex",
//                 flexDirection: "column",
//                 // width: "300px",
//               }}
//             >
//               <label className="eventmodallabelInput">
//                 Day of the Week:
//                 <select
//                   name="dayOfWeek"
//                   value={courseDetails.dayOfWeek}
//                   onChange={handleEventAdd}
//                   className="modallabelInput"
//                 >
//                   <option value="">Select Day</option>
//                   <option value="1">Monday</option>
//                   <option value="2">Tuesday</option>
//                   <option value="3">Wednesday</option>
//                   <option value="4">Thursday</option>
//                   <option value="5">Friday</option>
//                   <option value="6">Saturday</option>
//                   <option value="0">Sunday</option>
//                 </select>
//               </label>
//               <label className="eventmodallabelInput">
//                 Start Date:
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={courseDetails.startDate}
//                   onChange={handleEventAdd}
//                   className="modallabelInput"
//                 />
//               </label>
//               <label className="eventmodallabelInput">
//                 End Date:
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={courseDetails.endDate}
//                   onChange={handleEventAdd}
//                   className="modallabelInput"
//                 />
//               </label>
//               {/* <label className="eventmodallabelInput">
//                 Start Time:
//                 <input
//                   type="time"
//                   name="startTime"
//                   value={courseDetails.startTime}
//                   onChange={handleEventAdd}
//                   className="modallabelInput"
//                 />
//               </label> */}
//               <label className="eventmodallabelInput">
//                 Start Time:
//                 <select
//                   name="startTime"
//                   value={courseDetails.startTime}
//                   onChange={handleEventAdd}
//                   className="modallabelInput"
//                 >
//                   <option value="">Select Time</option>
//                   {/* {[...Array(25).keys()].map((hour) => (
//                     <React.Fragment key={hour}>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >{`${hour.toString().padStart(2, "0")}:00`}</option>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:30`}
//                       >{`${hour.toString().padStart(2, "0")}:30`}</option>
//                     </React.Fragment>
//                   ))} */}
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour}>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >{`${hour.toString().padStart(2, "0")}:00 AM`}</option>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:30`}
//                       >{`${hour.toString().padStart(2, "0")}:30 AM`}</option>
//                     </React.Fragment>
//                   ))}
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour + 12}>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:00`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:00 PM`}</option>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:30`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:30 PM`}</option>
//                     </React.Fragment>
//                   ))}
//                 </select>
//               </label>
//               {/* <label className="eventmodallabelInput">
//                 End Time:
//                 <input
//                   type="time"
//                   name="endTime"
//                   value={courseDetails.endTime}
//                   onChange={handleEventAdd}
//                   className="modallabelInput"
//                 />
//               </label> */}
//               <label className="eventmodallabelInput">
//                 End Time:
//                 <select
//                   name="endTime"
//                   value={courseDetails.endTime}
//                   onChange={handleEventAdd}
//                   className="modallabelInput"
//                 >
//                   <option value="">Select Time</option>
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour}>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >{`${hour.toString().padStart(2, "0")}:00 AM`}</option>
//                       <option
//                         value={`${hour.toString().padStart(2, "0")}:30`}
//                       >{`${hour.toString().padStart(2, "0")}:30 AM`}</option>
//                     </React.Fragment>
//                   ))}
//                   {[...Array(12).keys()].map((hour) => (
//                     <React.Fragment key={hour + 12}>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:00`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:00 PM`}</option>
//                       <option
//                         value={`${(hour + 12).toString().padStart(2, "0")}:30`}
//                       >{`${(hour + 12)
//                         .toString()
//                         .padStart(2, "0")}:30 PM`}</option>
//                     </React.Fragment>
//                   ))}
//                 </select>
//               </label>
//             </div>
//           </div>
//           <div
//             style={{
//               width: "100%",
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "center",
//               marginTop: "20px",
//             }}
//           >
//             <button onClick={handleSubmit} className="addcourseBtn">
//               Add Course
//             </button>
//             <button
//               onClick={closeAddCourseModal}
//               className="closecoursemodalBtn"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateCourseTimetable;
