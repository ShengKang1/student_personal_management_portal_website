import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import Swal from "sweetalert2";
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
  collection,
  firestore,
} from "../firebase";
import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "./StudentRegisteredCourse.css";
import ViewIcon from "../assets/view_icon.png";
import "../assets/utilities/Global_Design.css";
import StudentRegisteredCourseShowModal from "./StudentRegisteredCourseShowModal";

function StudentRegisteredCourse() {
  let dataTable;
  let registeredCourse = [];

  const [showViewForm, setShowViewForm] = useState(false);
  const [studentRegisteredCourseData, setStudentRegisteredCourseData] =
    useState([]);

  useEffect(() => {
    dataTable = $("#StudentRegisteredCourseDataTable").DataTable({
      destroy: true,
      data: registeredCourse,
      columns: [
        { data: "student_id", title: "Student ID" },
        { data: "registed_courses", title: "Registed Courses" },
        {
          data: "id",
          title: "View",
          render: function (data, type, row) {
            return (
              '<div class = "manageAction data_table_icon_background" ><img src="' +
              ViewIcon +
              '" alt="Your Icon" class="data_table_icon" /></div>'
            );
          },
        },
      ],
    });

    const fetchData = async () => {
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
        const querySnapshot = await getDocs(
          collection(firestore, "student_registed_course")
        );
        registeredCourse = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          registeredCourse.push({
            id: doc.id,
            student_id: data.student_id,
            registed_courses: data.registed_courses,
          });
        });

        // Update DataTable with the fetched data
        dataTable.clear().rows.add(registeredCourse).draw();

        Swal.close();
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error rejecting data",
          text: "Please try again.",
          confirmButtonText: "OK",
        });
      }
    };

    fetchData();

    $("#StudentRegisteredCourseDataTable").on(
      "click",
      ".manageAction",
      manageActionHandler
    );

    return () => {
      $("#StudentRegisteredCourseDataTable").off(
        "click",
        ".manageAction",
        manageActionHandler
      );
    };
  }, []);

  const manageActionHandler = async function (event) {
    const rowIndex = dataTable.row($(this).closest("tr")).index();
    const rowData = dataTable.row(rowIndex).data();

    setStudentRegisteredCourseData(rowData);
    setShowViewForm(true);
  };

  const closeManageModal = () => {
    setShowViewForm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "32px" }}>Check Student Registered Course</div>
      </div>

      <table id="StudentRegisteredCourseDataTable">
        <thead></thead>
        <tbody></tbody>
      </table>

      {showViewForm && (
        <StudentRegisteredCourseShowModal
          student_id={studentRegisteredCourseData.student_id}
          registed_courses={studentRegisteredCourseData.registed_courses}
          open={showViewForm}
          onClose={closeManageModal}
        />
      )}
    </div>
  );
}

export default StudentRegisteredCourse;
