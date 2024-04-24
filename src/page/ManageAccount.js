import React, { useEffect, useState } from "react";
import $ from "jquery";
import Swal from "sweetalert2";
import { doc, getDocs, updateDoc, collection, firestore } from "../firebase";
import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "./ManageAccount.css";
import ManageIcon from "../assets/manage_icon.png";
import "../assets/utilities/Global_Design.css";
import ManageAccountShowModal from "./ManageAccountShowModal";

function ManageAccount() {
  let dataTable;
  let students = [];

  const [showForm, setShowForm] = useState(false);
  const [studentData, setstudentData] = useState([]);
  const [programmeDropDownData, setProgrammeDropDownData] = useState([]);
  const [specializationDropDownData, setSpecializationDropDownData] = useState(
    []
  );
  const [intakeDropDownData, setIntakeDropDownData] = useState([]);

  useEffect(() => {
    dataTable = $("#studentaccountTable").DataTable({
      destroy: true,
      data: students,
      columns: [
        { data: "studentId", title: "Student ID" },
        { data: "studentName", title: "Student Name" },
        { data: "personalEmail", title: "Email" },
        { data: "phoneNumber", title: "Phone Number" },
        { data: "programme", title: "Programme" },
        { data: "specialization", title: "Specialization" },
        { data: "intake", title: "Intake" },
        {
          data: "id",
          title: "Manage",
          // render: function (data, type, row) {
          //   return `<button class="manageAction" style="display: block; margin: 0 auto";>Manage</button>`;
          // },
          render: function (data, type, row) {
            return (
              '<div class = "manageAction data_table_icon_background"><img src="' +
              ManageIcon +
              '" alt="Your Icon" class="data_table_icon" /></div>'
            );
          },
        },
      ],
    });

    fetchData();

    const fetchProgrammes = async () => {
      try {
        const programmeCollection = await getDocs(
          collection(firestore, "programme")
        );
        const programmesData = programmeCollection.docs.map(
          (doc) => doc.data().programme
        );

        setProgrammeDropDownData(programmesData);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchProgrammes();

    const fetchSpecialization = async () => {
      try {
        const specializationCollection = await getDocs(
          collection(firestore, "specialization")
        );
        const specializationData = specializationCollection.docs.map(
          (doc) => doc.data().specialization
        );
        setSpecializationDropDownData(specializationData);
      } catch (error) {
        console.error("Error fetching specialization:", error);
      }
    };

    fetchSpecialization();

    const fetchIntake = async () => {
      try {
        const intakeCollection = await getDocs(collection(firestore, "intake"));
        const intakeData = intakeCollection.docs.map(
          (doc) => doc.data().intake
        );
        setIntakeDropDownData(intakeData);
      } catch (error) {
        console.error("Error fetching intake:", error);
      }
    };

    fetchIntake();

    $("#studentaccountTable").on("click", ".manageAction", manageActionHandler);

    return () => {
      $("#studentaccountTable").off(
        "click",
        ".manageAction",
        manageActionHandler
      );
    };
  }, []);

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
      const querySnapshot = await getDocs(collection(firestore, "students"));
      students = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        students.push({
          id: doc.id,
          studentId: data.student_id,
          studentName: data.student_name,
          personalEmail: data.personal_email,
          phoneNumber: data.phone_number,
          programme: data.programme,
          specialization: data.specialization,
          intake: data.intake,
        });
      });

      // Update DataTable with the fetched data
      dataTable.clear().rows.add(students).draw();

      Swal.close();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error rejecting data",
        text: "Please try again." + error.message,
        confirmButtonText: "OK",
      });
    }
  };

  const manageActionHandler = async function (event) {
    const rowIndex = dataTable.row($(this).closest("tr")).index();
    const rowData = dataTable.row(rowIndex).data();

    setstudentData(rowData);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ fontSize: "36px", marginBottom: "20px" }}>
        Manage Account
      </div>

      <table id="studentaccountTable">
        <thead></thead>
        <tbody></tbody>
      </table>

      {showForm && (
        <ManageAccountShowModal
          id={studentData.id}
          studentId={studentData.studentId}
          studentName={studentData.studentName}
          personalEmail={studentData.personalEmail}
          phoneNumber={studentData.phoneNumber}
          intake={studentData.intake}
          programme={studentData.programme}
          specialization={studentData.specialization}
          programmeDropDownData={programmeDropDownData}
          specializationDropDownData={specializationDropDownData}
          intakeDropDownData={intakeDropDownData}
          open={showForm}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default ManageAccount;
