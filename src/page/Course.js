import React, { useEffect, useState } from "react";
import $ from "jquery";
import Swal from "sweetalert2";
import {
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  firestore,
} from "../firebase";
import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "./Course.css";
import ManageIcon from "../assets/manage_icon.png";
import CourseManageModal from "./CourseManageModal";
import CourseCreateModal from "./CourseCreateModal";

function Course() {
  let dataTable;
  let courses = [];

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [creditHoursDropDownData, setCreditHoursDropDownData] = useState([]);
  const [intakeDropDownData, setIntakeDropDownData] = useState([]);

  useEffect(() => {
    dataTable = $("#courseDataTable").DataTable({
      destroy: true,
      data: courses,
      columns: [
        { data: "courseCode", title: "Course Code" },
        { data: "courseName", title: "Course Name" },
        { data: "group", title: "Group" },
        { data: "creditHours", title: "Credit Hours" },
        { data: "intake", title: "Intake" },
        { data: "classification", title: "Classification" },
        { data: "remark", title: "Remark" },
        { data: "registerStatus", title: "Register Status" },

        {
          data: "id",
          title: "Manage",
          render: function (data, type, row) {
            return (
              '<div class = "manageAction data_table_icon_background" ><img src="' +
              ManageIcon +
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
        const querySnapshot = await getDocs(collection(firestore, "course"));
        courses = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          courses.push({
            id: doc.id,
            courseCode: data.course_code,
            courseName: data.course_name,
            group: data.group,
            creditHours: data.credit_hour,
            intake: data.intake,
            classification: data.classification,
            remark: data.remark,
            registerStatus: data.registerStatus,
          });
        });

        // Update DataTable with the fetched data
        dataTable.clear().rows.add(courses).draw();

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

    const fetchCreditHour = async () => {
      try {
        const credithourCollection = await getDocs(
          collection(firestore, "course_credit_hours")
        );
        const CreditHoursData = credithourCollection.docs.map(
          (doc) => doc.data().hours
        );

        // Sort the array in ascending order
        const sortedCreditHoursData = CreditHoursData.sort((a, b) => a - b);

        setCreditHoursDropDownData(sortedCreditHoursData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCreditHour();

    const fetchIntakeValues = async () => {
      try {
        const intakeCollection = await getDocs(collection(firestore, "intake"));
        const intakeData = intakeCollection.docs.map(
          (doc) => doc.data().intake
        );

        // Convert intake strings to Date objects
        const dateObjects = intakeData.map((intake) => {
          const [month, year] = intake.split(" ");
          const monthIndex = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].indexOf(month);
          return new Date(year, monthIndex);
        });

        // Sort the Date objects
        dateObjects.sort((a, b) => a - b);

        // Convert back to intake format
        const sortedIntakesData = dateObjects.map((date) => {
          const month = date.toLocaleString("default", { month: "long" });
          const year = date.getFullYear();
          return `${month} ${year}`;
        });

        setIntakeDropDownData(sortedIntakesData);
      } catch (error) {
        console.error("Error fetching checkbox values:", error);
      }
    };

    fetchIntakeValues();

    $("#courseDataTable").on("click", ".manageAction", manageActionHandler);

    return () => {
      $("#courseDataTable").off("click", ".manageAction", manageActionHandler);
    };
  }, []);

  const manageActionHandler = async function (event) {
    const rowIndex = dataTable.row($(this).closest("tr")).index();
    const rowData = dataTable.row(rowIndex).data();

    setCourseData(rowData);
    setShowManageForm(true);
  };

  const closeManageModal = () => {
    setShowManageForm(false);
  };

  const openCreateModalbtn = () => {
    setShowCreateForm(true);
  };

  const closeCreateModal = () => {
    setShowCreateForm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "32px" }}>Course Data</div>
        <button
          type="button"
          className="all_upper_button_style update_modal_button"
          onClick={openCreateModalbtn}
        >
          Add New Course
        </button>
      </div>

      <table id="courseDataTable">
        <thead></thead>
        <tbody></tbody>
      </table>

      {showCreateForm && (
        <CourseCreateModal
          creditHoursDropDownData={creditHoursDropDownData}
          intakeDropDownData={intakeDropDownData}
          open={showCreateForm}
          onClose={closeCreateModal}
        />
      )}

      {showManageForm && (
        <CourseManageModal
          id={courseData.id}
          courseCode={courseData.courseCode}
          courseName={courseData.courseName}
          group={courseData.group}
          creditHours={courseData.creditHours}
          intake={courseData.intake}
          classification={courseData.classification}
          remark={courseData.remark}
          registerStatus={courseData.registerStatus}
          creditHoursDropDownData={creditHoursDropDownData}
          intakeDropDownData={intakeDropDownData}
          open={showManageForm}
          onClose={closeManageModal}
        />
      )}
    </div>
  );
}

export default Course;
