// V1
import React, { useEffect } from "react";
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

const AccountPendingData = () => {
  let dataTable;
  let students = [];

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
        { data: "studentId", title: "Student ID" },
        // {
        //   data: "studentName",
        //   title: "Student Name",
        //   className: "data",
        //   render: function (data, type, full, meta) {
        //     return (
        //       '<img src="/assets/warning_icon.png" alt="Your Icon" class="icon" />' +
        //       data
        //     );
        //   },
        // },
        { data: "studentName", title: "Student Name", className: "data" },
        { data: "personalEmail", title: "Email" },
        { data: "phoneNumber", title: "Phone Number" },
        { data: "programme", title: "Programme" },
        { data: "specialization", title: "Specialization" },
        { data: "intake", title: "Intake" },
        { data: "date", title: "Date" },
        { data: "time", title: "Time" },
        { data: "status", title: "Status" },
        {
          data: "id",
          title: "Approve",
          render: function (data, type, row) {
            return `<button class="approveAction">Approve</button>`;
          },
        },
        {
          data: "id",
          title: "Reject",
          render: function (data, type, row) {
            return `<button class="rejectAction">Reject</button>`;
          },
        },
      ],
      order: [],
    });

    fetchData();

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
    $("#studentTable").on("click", "td:nth-child(3)", showStudentInformation);

    // Cleanup event handlers on component unmount
    return () => {
      $("#studentTable").off("click", ".approveAction", approveActionHandler);
      $("#studentTable").off("click", ".rejectAction", rejectActionHandler);
      $("#studentTable").off("change", ".rowCheckbox", handleRowCheckboxChange);
      $("#selectAllCheckbox").off("change", handleSelectAllCheckboxChange);
      $("#studentTable").on("click", "td:nth-child(3)", showStudentInformation);
    };
  }, []);

  const showStudentInformation = function () {
    var studentName = $(this).text();

    console.log(studentName);
  };

  $("#yourDataTable").on("click", "td:nth-child(3)", function () {
    // Get the student name from the clicked row
    var studentName = $(this).text();

    // Show your modal with the student name
    // Example: $('#yourModal').modal('show');
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
          phoneNumber: data.phone_number,
          programme: data.programme,
          specialization: data.specialization,
          intake: data.intake,
          date: formatDate(dateObject),
          time: formatTime(dateObject),
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

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear() % 100;
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
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
    </div>
  );
};

export default AccountPendingData;
