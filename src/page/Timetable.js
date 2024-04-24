import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import Swal from "sweetalert2";
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  addDoc,
  deleteDoc,
  collection,
  where,
  firestore,
} from "../firebase";
import TimetableCreateModal from "./TimetableCreateModal";
import TimetableManageModal from "./TimetableManageModal";

function Timetable() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [eventID, setEventID] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [eventColorData, setEventColorData] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [allTimetableData, setAllTimetableData] = useState([]);
  const allTimetableRef = useRef(allTimetableData);

  const getTimetableLatestInfo = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "course_timetable")
    );
    const allData = querySnapshot.docs.map((val) => ({
      ...val.data(),
      id: val.id,
    }));

    setAllTimetableData(allData);
    // console.log("Data: ", allData);
  };

  useEffect(() => {
    // console.log("Run!");
    allTimetableRef.current = allTimetableData;
    // console.log(studentInfoRef);
  }, [allTimetableData]);

  useEffect(() => {
    getTimetableLatestInfo();

    const fetchEvents = async () => {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const coursesCollection = collection(firestore, "course_timetable");
        const snapshot = await getDocs(coursesCollection);
        const eventsData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const course = doc.data();

            // const studentAmount = course.studentAmount;
            // // console.log(studentAmount);
            // const counts = studentAmount.split(", ");

            // // Calculate the total number of students
            // const totalStudents = counts.reduce(
            //   (total, count) => total + parseInt(count),
            //   0
            // );

            // // Format the result as (1+3)4
            // const formattedstudentAmount = `(${counts.join(
            //   "+"
            // )})${totalStudents}`;
            const studentAmount = course.studentAmount;
            const counts = studentAmount.split(", ");

            let formattedStudentAmount;
            if (counts.length === 1) {
              formattedStudentAmount = `(${counts[0]})`;
            } else {
              const totalStudents = counts.reduce(
                (total, count) => total + parseInt(count),
                0
              );
              formattedStudentAmount = `(${counts.join("+")})${totalStudents}`;
            }

            // console.log(formattedstudentAmount);

            const dayOfWeek = parseInt(course.dayOfWeek, 10);
            const start = new Date(course.startDate);
            const end = new Date(course.endDate);
            const dates = [];
            let current = new Date(start);

            let dayOfWeekFormatted;
            switch (dayOfWeek) {
              case 1:
                dayOfWeekFormatted = "Monday";
                break;
              case 2:
                dayOfWeekFormatted = "Tuesday";
                break;
              case 3:
                dayOfWeekFormatted = "Wednesday";
                break;
              case 4:
                dayOfWeekFormatted = "Thursday";
                break;
              case 5:
                dayOfWeekFormatted = "Friday";
                break;
              case 6:
                dayOfWeekFormatted = "Saturday";
                break;
              case 0:
                dayOfWeekFormatted = "Sunday";
                break;
              default:
                dayOfWeekFormatted = "";
            }

            while (current <= end) {
              if (current.getDay() === dayOfWeek) {
                dates.push(new Date(current));
              }
              current.setDate(current.getDate() + 1);
            }

            const newEvents = await Promise.all(
              dates.map(async (date) => {
                const startTime = new Date(
                  `${date.toDateString()} ${course.startTime}`
                );
                const endTime = new Date(
                  `${date.toDateString()} ${course.endTime}`
                );

                const startDateString = start.toLocaleDateString("en-GB");
                const endDateString = end.toLocaleDateString("en-GB");
                const startTimeString = startTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
                const endTimeString = endTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });

                return {
                  // color: "green",
                  id: course.id,
                  title: `${course.course} ${formattedStudentAmount}, ${course.lecturer}, ${startTimeString} - ${endTimeString}, <${course.class}>, [${dayOfWeekFormatted}, ${startDateString} - ${endDateString}]`,
                  start: startTime,
                  end: endTime,
                  backgroundColor: course.eventColor,
                };
              })
            );

            return newEvents;
          })
        );

        setEvents(eventsData.flat());

        Swal.close();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
        return;
      }
    };

    fetchEvents();

    const fetchCourse = async () => {
      try {
        const courseCollection = await getDocs(collection(firestore, "course"));
        const courseData = courseCollection.docs.map((doc) => {
          const data = doc.data();
          const groupInfo =
            data.group && data.group !== "none" ? ` (${data.group})` : "";

          return `${data.course_code} ${data.course_name}${groupInfo}`;
        });

        setCourseData(courseData);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchCourse();
  }, []);

  const openAddCourseModal = () => {
    setShowCreateForm(true);
  };

  const closeAddCourseModal = () => {
    setShowCreateForm(false);
  };

  const [tooltipElement, setTooltipElement] = useState("");
  const handleEventMouseEnter = (info) => {
    // console.log(info.event.title);
    const tooltipContent = info.event.title;

    // Create a div element for the tooltip
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");

    tooltip.textContent = tooltipContent;

    // Position the tooltip
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#f7f7f7";
    // tooltip.style.top = `${info.jsEvent.clientY}px`;
    // tooltip.style.left = `${info.jsEvent.clientX}px`;
    tooltip.style.fontSize = "16px";
    tooltip.style.display = "block";
    tooltip.style.zIndex = "1000"; // or any higher value
    tooltip.style.pointerEvents = "none";
    tooltip.style.width = "380px";
    tooltip.style.color = "black";
    // tooltip.style.backgroundColor = "#ffff40";
    tooltip.style.border = "1px solid black";
    tooltip.style.padding = "10px";
    tooltip.style.borderRadius = "10px";

    // Calculate the position of the event relative to the tooltip
    const eventRect = info.el.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    // const offsetLeft =
    //   eventRect.left + eventRect.width / 2 - tooltipRect.width / 2;
    // const offsetTop = eventRect.top + eventRect.height;

    const offsetLeft = eventRect.left - tooltipRect.width - 150;
    const offsetTop = eventRect.top - eventRect.width / 2;

    // Set the position of the tooltip
    tooltip.style.left = `${offsetLeft}px`;
    tooltip.style.top = `${offsetTop}px`;

    // Append the tooltip to the body
    document.body.appendChild(tooltip);

    // Store the tooltip element in state to remove it later
    setTooltipElement(tooltip);
  };

  const handleEventMouseLeave = () => {
    //Remove the tooltip from the body
    if (tooltipElement) {
      tooltipElement.remove();
      setTooltipElement(null);
    }
  };

  const handleOpenEventManageClick = async (eventClickInfo) => {
    const eventId = eventClickInfo.event.id;
    setEventID(eventId);
    // const eventTitle = eventClickInfo.event.title;
    // const eventColor = eventClickInfo.event.backgroundColor;
    // setEventData(eventTitle);
    // setEventColorData(eventColor);
    setShowManageForm(true);
  };

  const handleCloseEventManageClick = () => {
    setShowManageForm(false);
  };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        // weekends={false}
        // slotDuration="01:00:00"
        // slotLabelInterval="01:00"
        slotLabelFormat={{ hour: "numeric", minute: "2-digit" }}
        // dayHeaderFormat={{ weekday: "long" }}
        contentHeight="auto"
        height="parent"
        events={events}
        allDaySlot={false}
        slotMinTime="06:00:00" // Display from 8am
        slotMaxTime="21:00:00" // Display until 6pm
        headerToolbar={{
          left: "today addCourseTimeButton prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        customButtons={{
          addCourseTimeButton: {
            text: "Add Course Time",
            click: function () {
              openAddCourseModal();
            },
          },
        }}
        eventClick={handleOpenEventManageClick}
        // // eventContent={eventContent}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
      />

      {showCreateForm && (
        <TimetableCreateModal
          open={showCreateForm}
          onClose={closeAddCourseModal}
          courseData={courseData}
        />
      )}

      {showManageForm && (
        <TimetableManageModal
          open={showManageForm}
          onClose={handleCloseEventManageClick}
          courseData={courseData}
          id={eventID}
          allTimetableData={allTimetableRef}
          //   eventData={eventData}
          //   eventColorData={eventColorData}
        />
      )}
    </div>
  );
}

export default Timetable;
