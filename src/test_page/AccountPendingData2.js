//Latest Version
import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  firestore,
  auth,
  createUserWithEmailAndPassword,
} from "../firebase";
import Swal from "sweetalert2";
import "./AccountPendingData.css";
import "../assets/utilities/Global_Design.css";
import ProfileIcon from "../assets/profile_icon.png";
import ApproveIcon from "../assets/approve_button.png";
import RejectIcon from "../assets/reject_button.png";
import AccountPendingShowModal from "../components/AccountPendingShowModal";

const AccountPendingData = () => {
  let dataTable;
  let students = [];
  const [studentInfo, setStudentInfo] = useState([]);
  const studentInfoRef = useRef(studentInfo);
  const [searchStudentData, setSearchStudentData] = useState(null);

  // const [closeModel, setCloseModel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  // const studentInfoRef = [];

  // const handleCloseModel = () => {
  //   setCloseModel(true);
  // };

  const getLatestInfo = async () => {
    const querySnapshot = await getDocs(collection(firestore, "pending"));
    const allData = querySnapshot.docs.map((val) => ({
      ...val.data(),
      id: val.id,
    }));

    setStudentInfo(allData);
    // console.log("Data: ", allData);
  };

  useEffect(() => {
    // console.log("Run!");
    studentInfoRef.current = studentInfo;
    // console.log(studentInfoRef);
  }, [studentInfo]);

  useEffect(() => {
    // Initialize DataTable
    dataTable = $("#studentTable").DataTable({
      destroy: true, // Destroy existing DataTable instance, if any
      data: students,
      columns: [
        {
          data: null,
          title:
            "<input type='checkbox' id='selectAllCheckbox' class='selectAllCheckBox'/>", // Checkbox in the header
          defaultContent: "<input type='checkbox' class='rowCheckbox'/>", // Checkbox in each row
          orderable: false,
        },
        {
          data: "studentId",
          title: "Student ID",
          className: "data_cursor_pointer",
          render: function (data, type, row) {
            return (
              '<div class = "data_cells"><img src="' +
              ProfileIcon +
              '" alt="Your Icon" class="data_table_icon" /> ' +
              data +
              "</div>"
            );
          },
        },
        { data: "studentName", title: "Student Name" },
        { data: "personalEmail", title: "Email" },
        // { data: "phoneNumber", title: "Phone Number" },
        { data: "programme", title: "Programme" },
        { data: "specialization", title: "Specialization" },
        // { data: "intake", title: "Intake" },
        // { data: "date", title: "Date" },
        // { data: "time", title: "Time" },
        { data: "status", title: "Status" },
        // {
        //   data: "id",
        //   title: "Approve",
        //   render: function (data, type, row) {
        //     return `<button class="approveAction">Approve</button>`;
        //   },
        // },
        {
          data: "id",
          title: "Approve",
          render: function (data, type, row) {
            return (
              '<div class = "approveAction data_table_icon_background"><img src="' +
              ApproveIcon +
              '" alt="Your Icon" class="data_table_icon" /></div>'
            );
          },
          // class: "text-center",
          width: "60px",
        },
        {
          data: "id",
          title: "Reject",
          render: function (data, type, row) {
            return (
              '<div class = "rejectAction data_table_icon_background"><img src="' +
              RejectIcon +
              '" alt="Your Icon" class="data_table_icon" /></div>'
            );
          },
          width: "60px",
        },
      ],
      order: [],
    });

    fetchData();
    getLatestInfo();

    // Event handler for Approve button
    $("#studentTable").on("click", ".approveAction", approveActionHandler);

    $("#studentTable").on("click", ".rejectAction", rejectActionHandler);
    // Event handler for individual row checkboxes
    // $("#studentTable").on("change", ".rowCheckbox", function () {
    //   const allChecked =
    //     $(".rowCheckbox:checked").length === $(".rowCheckbox").length;
    //   $("#selectAllCheckbox").prop("checked", allChecked);

    //   const $row = $(this).closest("tr");
    //   if ($(this).prop("checked")) {
    //     $row.addClass("selected");
    //   } else {
    //     $row.removeClass("selected");
    //   }
    // });

    $("#studentTable").on("change", ".rowCheckbox", handleRowCheckboxChange);

    // Event handler for "Select All" checkbox
    // $("#selectAllCheckbox").on("change", function () {
    //   $(".rowCheckbox").prop("checked", $(this).prop("checked"));
    //   $(".rowCheckbox").each(function () {
    //     const $row = $(this).closest("tr");
    //     if ($(this).prop("checked")) {
    //       $row.addClass("selected");
    //     } else {
    //       $row.removeClass("selected");
    //     }
    //   });
    // });

    $("#selectAllCheckbox").on("change", handleSelectAllCheckboxChange);
    $("#studentTable").on("click", "td:nth-child(2)", showStudentInformation);

    // Cleanup event handlers on component unmount
    return () => {
      $("#studentTable").off("click", ".approveAction", approveActionHandler);
      $("#studentTable").off("click", ".rejectAction", rejectActionHandler);
      $("#studentTable").off("change", ".rowCheckbox", handleRowCheckboxChange);
      $("#selectAllCheckbox").off("change", handleSelectAllCheckboxChange);
      $("#studentTable").off(
        "click",
        "td:nth-child(2)",
        showStudentInformation
      );
    };
  }, []);

  const showStudentInformation = function () {
    var studentID = $(this).text().trim();

    const searchInfo = studentInfoRef.current.find(
      (info) => info.student_id === studentID
    );

    // console.log("Searched Student Info: ", searchInfo);

    setShowForm(true);
    setSearchStudentData(searchInfo);
    // setCloseModel(false);

    // console.log(studentID);
  };

  const closeModal = () => {
    setShowForm(false);
  };

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
      const querySnapshot = await getDocs(collection(firestore, "pending"));
      students = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateObject = data.request_at.toDate();

        students.push({
          id: doc.id,
          studentId: data.student_id,
          studentName: data.student_name,
          personalEmail: data.personal_email,
          password: data.password,
          // phoneNumber: data.phone_number,
          programme: data.programme,
          specialization: data.specialization,
          // intake: data.intake,
          // date: formatDate(dateObject),
          // time: formatTime(dateObject),
          status: data.status,
        });
      });

      // Update DataTable with the fetched data
      dataTable.clear().rows.add(students).draw();

      Swal.close();
    } catch (error) {
      console.error("Error fetching data: ", error);

      await Swal.fire({
        icon: "error",
        title: "Error rejecting data",
        text: "Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const approveActionHandler = async function (event) {
    const result = await Swal.fire({
      title: "Confirm Approval",
      text: "Do you want to approve?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const rowIndex = dataTable.row($(this).closest("tr")).index();
      const rowData = dataTable.row(rowIndex).data();

      Swal.fire({
        title: "Processing",
        text: "Approving account, please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      const pendingDocRef = doc(firestore, "pending", rowData.id);
      const pendingDocSnapshot = await getDoc(pendingDocRef);

      if (pendingDocSnapshot.exists()) {
        const data = pendingDocSnapshot.data();

        try {
          await createUserWithEmailAndPassword(
            auth,
            data.personal_email,
            data.password
          );

          const studentRef = doc(firestore, "students", rowData.id);
          const updateFirestore = await setDoc(studentRef, {
            student_id: data.student_id,
            student_name: data.student_name,
            personal_email: data.personal_email,
            phone_number: data.phone_number,
            programme: data.programme,
            specialization: data.specialization,
            intake: data.intake,
            // Add other fields as needed
          });

          // Delete the document from the "pending" collection
          const deletePendingDoc = deleteDoc(pendingDocRef);

          // Wait for both Firestore operations to complete
          await Promise.all([updateFirestore, deletePendingDoc]);

          // Show a success alert using SweetAlert
          Swal.fire({
            icon: "success",
            title: "Approve account successful!",
            text: `Student ID: ${rowData.id}`,
            confirmButtonText: "OK",
            allowOutsideClick: false,
          });

          // Refresh the table after approval
          fetchData();
        } catch (error) {
          // Handle createUserWithEmailAndPassword errors
          if (error.code === "auth/email-already-in-use") {
            // Email is already in use, show an error message
            Swal.fire({
              icon: "error",
              title: "Email already in use",
              text: "The provided email address is already associated with an existing account.",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Approve account fail!",
              text: `Document with ID ${rowData.id} not found in 'pending' collection`,
              confirmButtonText: "OK",
              allowOutsideClick: false,
            });
          }
        }
      } else {
        console.error(
          `Document with ID ${rowData.id} not found in 'pending' collection`
        );
      }
    } else {
      Swal.close();
    }
  };

  const rejectActionHandler = async function (event) {
    const result = await Swal.fire({
      title: "Confirm Reject",
      text: "Do you want to reject?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, reject!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      //Reject Action

      const rowIndex = dataTable.row($(this).closest("tr")).index();
      const rowData = dataTable.row(rowIndex).data();
      try {
        Swal.fire({
          title: "Processing",
          text: "Rejecting account, please wait...",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        const pendingDocRef = doc(firestore, "pending", rowData.id);

        // Delete the document from the "pending" collection
        await deleteDoc(pendingDocRef);

        // Show a success alert using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Reject approve account successful!",
          text: `Student ID: ${rowData.id}`,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          fetchData();
        });
      } catch (error) {
        console.error("Error approving data:", error);
      }
    } else {
      Swal.close();
    }
  };

  const handleApproveSelected = async () => {
    const selectedRows = $(".rowCheckbox:checked")
      .map(function () {
        return dataTable.row($(this).closest("tr")).data();
      })
      .toArray();

    if (selectedRows.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No rows selected",
        text: "Please select at least one row to approve.",
        confirmButtonText: "OK",
      });
    } else {
      try {
        Swal.fire({
          title: "Confirm Approval",
          text: "Do you want to approve?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, approve!",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Processing",
              text: "Approving account, please wait...",
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            // Loop through selected rows and store data in Firestore
            for (const row of selectedRows) {
              const { ...studentData } = row; // Exclude date and time fields
              // Create user with email and password
              await createUserWithEmailAndPassword(
                auth,
                row.personalEmail,
                row.password
              );
              // Set specific field values
              const studentDocRef = doc(firestore, "students", row.id);
              await setDoc(studentDocRef, {
                student_id: row.studentId,
                student_name: row.studentName,
                personal_email: row.personalEmail,
                programme: row.programme,
                specialization: row.specialization,
                intake: row.intake,
                // Include email in Firestore
                // Add more fields as needed
              });

              // Delete the document from the "pending" collection
              await deleteDoc(doc(firestore, "pending", row.id));
            }

            // Show success alert
            Swal.fire({
              icon: "success",
              title: "Approve accounts successful!",
              text: "Selected rows have been approved.",
              confirmButtonText: "OK",
              allowOutsideClick: false,
            });

            // Refresh the table after approval
            fetchData();
          }
        });
      } catch (error) {
        console.error("Error approving data:", error);
        Swal.fire({
          icon: "error",
          title: "Approve accounts failed",
          text: "An error occurred while approving the selected rows.",
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleRejectSelected = async () => {
    const selectedRows = $(".rowCheckbox:checked")
      .map(function () {
        return dataTable.row($(this).closest("tr")).data();
      })
      .toArray();

    if (selectedRows.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No rows selected",
        text: "Please select at least one row to reject.",
        confirmButtonText: "OK",
      });
    } else {
      const result = await Swal.fire({
        title: "Confirm Reject",
        text: "Do you want to reject?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, reject!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing",
          text: "Approving account, please wait...",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        for (const row of selectedRows) {
          try {
            Swal.fire({
              title: "Processing",
              text: "Rejecting account, please wait...",
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            const pendingDocRef = doc(firestore, "pending", row.id);

            // Delete the document from the "pending" collection
            await deleteDoc(pendingDocRef);

            Swal.fire({
              icon: "success",
              title: "Reject account successful!",
              text: "Selected rows have been approved.",
              allowOutsideClick: false,
              confirmButtonText: "OK",
            });

            fetchData(); // Refresh the table after rejection
          } catch (error) {
            console.error("Error rejecting data:", error);
          }
        }
      }
    }
  };

  const handleRowCheckboxChange = function () {
    const $row = $(this).closest("tr");
    if ($(this).prop("checked")) {
      $row.addClass("selected");
    } else {
      $row.removeClass("selected");
    }

    const allChecked =
      $(".rowCheckbox:checked").length === $(".rowCheckbox").length;
    $("#selectAllCheckbox").prop("checked", allChecked);
  };

  const handleSelectAllCheckboxChange = function () {
    const isChecked = $(this).prop("checked");
    $(".rowCheckbox").prop("checked", isChecked);
    $(".rowCheckbox").each(function () {
      const $row = $(this).closest("tr");
      isChecked ? $row.addClass("selected") : $row.removeClass("selected");
    });
  };

  return (
    <div>
      <div className="mb-3">
        <button onClick={handleApproveSelected} className="approveSelectedbtn">
          Approve Selected
        </button>
        <button onClick={handleRejectSelected} className="rejectSelectedbtn">
          Reject Selected
        </button>
      </div>
      <table id="studentTable" className="table table-bordered mx-auto">
        <thead></thead>
        <tbody></tbody>
      </table>

      {showForm && (
        <AccountPendingShowModal
          student_id={searchStudentData.student_id}
          student_name={searchStudentData.student_name}
          personal_email={searchStudentData.personal_email}
          phone_number={searchStudentData.phone_number}
          programme={searchStudentData.programme}
          specialization={searchStudentData.specialization}
          intake={searchStudentData.intake}
          request_at={searchStudentData.request_at}
          status={searchStudentData.status}
          open={showForm}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AccountPendingData;
