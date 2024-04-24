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
import "./RegisterForm.css";
import ManageIcon from "../assets/manage_icon.png";
import "../assets/utilities/Global_Design.css";
import RegisterFormCreateModal from "./RegisterFormCreateModal";
import RegisterFormManageModal from "./RegisterFormManageModal";

function RegisterForm() {
  let dataTable;
  let registerForm = [];

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [registerFormData, setRegisterFormData] = useState([]);
  const [allRegisterFormData, setAllRegisterFormData] = useState([]);
  const [studentInfo, setStudentInfo] = useState([]);
  const allRegisterFormDataRef = useRef(allRegisterFormData);
  const [getCourseName, setCourseName] = useState([]);

  const getLatestInfo = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "course_register_form")
    );
    const allData = querySnapshot.docs.map((val) => ({
      ...val.data(),
      id: val.id,
    }));

    setAllRegisterFormData(allData);
    // console.log("Data: ", allData);
  };

  useEffect(() => {
    // console.log("Run!");
    allRegisterFormDataRef.current = allRegisterFormData;
    // console.log(studentInfoRef);
  }, [allRegisterFormData]);

  useEffect(() => {
    dataTable = $("#registerFormDataTable").DataTable({
      destroy: true,
      data: registerForm,
      columns: [
        { data: "title", title: "Title" },
        { data: "note", title: "Note" },
        { data: "startDate", title: "Start Date" },
        { data: "endDate", title: "End Date" },
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

    getLatestInfo();

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
          collection(firestore, "course_register_form")
        );
        registerForm = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          registerForm.push({
            id: doc.id,
            title: data.title,
            note: data.note,
            startDate: data.startDate,
            endDate: data.endDate,
          });
        });

        // Update DataTable with the fetched data
        dataTable.clear().rows.add(registerForm).draw();

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

    const fetchCourse = async () => {
      try {
        const courseCollection = await getDocs(
          query(
            collection(firestore, "course"),
            where("registerStatus", "==", "open")
          )
        );
        const courseData = courseCollection.docs.map((doc) => {
          const data = doc.data();
          const groupInfo =
            data.group && data.group !== "none" ? ` (${data.group})` : "";

          return `${data.course_code} ${data.course_name}${groupInfo}`;
        });

        setCourseName(courseData);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchCourse();

    $("#registerFormDataTable").on(
      "click",
      ".manageAction",
      manageActionHandler
    );

    return () => {
      $("#registerFormDataTable").off(
        "click",
        ".manageAction",
        manageActionHandler
      );
    };
  }, []);

  const manageActionHandler = async function (event) {
    const rowIndex = dataTable.row($(this).closest("tr")).index();
    const rowData = dataTable.row(rowIndex).data();

    setRegisterFormData(rowData);
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
        <div style={{ fontSize: "32px" }}>Register Form</div>
        <button
          type="button"
          className="all_upper_button_style create_modal_button"
          onClick={openCreateModalbtn}
        >
          Create Register Form
        </button>
      </div>

      <table id="registerFormDataTable">
        <thead></thead>
        <tbody></tbody>
      </table>

      {showCreateForm && (
        <RegisterFormCreateModal
          open={showCreateForm}
          onClose={closeCreateModal}
        />
      )}

      {showManageForm && (
        <RegisterFormManageModal
          id={registerFormData.id}
          allData={allRegisterFormDataRef}
          courseCheckBoxData={getCourseName}
          open={showManageForm}
          onClose={closeManageModal}
        />
      )}
    </div>
  );
}

export default RegisterForm;
