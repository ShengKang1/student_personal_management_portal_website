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
  query,
  where,
  firestore,
  auth,
  createUserWithEmailAndPassword,
} from "../firebase";
import Swal from "sweetalert2";
import "../assets/utilities/Global_Design.css";
import ProfileIcon from "../assets/profile_icon.png";
import ApproveIcon from "../assets/approve_icon.png";
import RejectIcon from "../assets/reject_icon.png";
import ApproveCourseShowModal from "./ApproveCourseShowModal";
import "./ApproveCourse.css";

const ApproveCourse = () => {
  let dataTable;
  let approveCourseData = [];
  const [studentInfo, setStudentInfo] = useState([]);
  const studentInfoRef = useRef(studentInfo);
  const [searchStudentData, setSearchStudentData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isDataTableInitialized, setIsDataTableInitialized] = useState(false);

  const getLatestInfo = async () => {
    const querySnapshot = await getDocs(collection(firestore, "students"));
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
    dataTable = $("#approveCourseDataTable").DataTable({
      destroy: true, // Destroy existing DataTable instance, if any
      data: approveCourseData,
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
              '<div class = "data_cells"><img style="width:30px" src="' +
              ProfileIcon +
              '" alt="Your Icon" class="data_table_icon" /> ' +
              data +
              "</div>"
            );
          },
        },
        { data: "studentName", title: "Student Name" },
        { data: "register_course_request", title: "Course Request" },
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

    setIsDataTableInitialized(true);
    fetchData();
    getLatestInfo();

    $("#approveCourseDataTable").on(
      "click",
      ".approveAction",
      approveActionHandler
    );
    $("#approveCourseDataTable").on(
      "click",
      ".rejectAction",
      rejectActionHandler
    );
    $("#approveCourseDataTable").on(
      "change",
      ".rowCheckbox",
      handleRowCheckboxChange
    );
    $("#selectAllCheckbox").on("change", handleSelectAllCheckboxChange);
    $("#approveCourseDataTable").on(
      "click",
      "td:nth-child(2)",
      showStudentInformation
    );

    return () => {
      $("#approveCourseDataTable").off(
        "click",
        ".approveAction",
        approveActionHandler
      );
      $("#approveCourseDataTable").off(
        "click",
        ".rejectAction",
        rejectActionHandler
      );
      $("#approveCourseDataTable").off(
        "change",
        ".rowCheckbox",
        handleRowCheckboxChange
      );
      $("#selectAllCheckbox").off("change", handleSelectAllCheckboxChange);
      $("#approveCourseDataTable").off(
        "click",
        "td:nth-child(2)",
        showStudentInformation
      );
    };
  }, []);

  const showStudentInformation = function () {
    var studentID = $(this).text().trim();
    console.log(studentID);
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
      // // Get all students
      // const studentsQuerySnapshot = await getDocs(
      //   collection(firestore, "students")
      // );

      // // Iterate over each student
      // studentsQuerySnapshot.forEach(async (studentDoc) => {
      //   const studentId = studentDoc.id;

      //   // Check if the student has pending register courses
      //   const pendingCoursesQuerySnapshot = await getDocs(
      //     query(
      //       collection(firestore, "pending_register_course"),
      //       where("student_id", "==", studentId)
      //     )
      //   );

      //   if (!pendingCoursesQuerySnapshot.empty) {
      //     // Student has pending register courses
      //     console.log(`Student ${studentId} has pending register courses.`);
      //     // Perform actions for students with pending register courses
      //   } else {
      //     // Student does not have pending register courses
      //     console.log(
      //       `Student ${studentId} does not have pending register courses.`
      //     );
      //     // Perform actions for students without pending register courses
      //   }
      // });

      const querySnapshot = await getDocs(
        collection(firestore, "pending_register_course")
      );
      approveCourseData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        approveCourseData.push({
          id: doc.id,
          studentId: data.student_id,
          studentName: data.student_name,
          register_course_request: data.selected_courses,
        });
      });

      // Update DataTable with the fetched data
      dataTable.clear().rows.add(approveCourseData).draw();

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
      text: "Do you want to approve course?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve!",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Processing",
        text: "Approving student course request, please wait...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const rowIndex = dataTable.row($(this).closest("tr")).index();
        const rowData = dataTable.row(rowIndex).data();

        const registed_course = [];

        $(this)
          .closest("tr")
          .find("td:nth-child(4)")
          .each(function () {
            const courses = $(this).text().trim().split(",");
            courses.forEach((course) => {
              registed_course.push(course.trim());
            });
          });

        // console.log(registed_course);

        const courseTakenHistoryRef = doc(
          firestore,
          "course_taken_history",
          rowData.id
        );
        const courseTakenHistoryDoc = await getDoc(courseTakenHistoryRef);
        let registedCoursesData = {};

        if (courseTakenHistoryDoc.exists()) {
          registedCoursesData = courseTakenHistoryDoc.data().registed_courses;
        }

        let index = Object.keys(registedCoursesData).length + 1;

        // Fetch course details for each new course in registed_course
        await Promise.all(
          registed_course.map(async (courseStr) => {
            const [courseCode] = courseStr.split(" ");
            const courseDoc = await getDoc(
              doc(firestore, "course", courseCode)
            );
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              registedCoursesData[index] = {
                course: courseStr,
                credit_hours: courseData.credit_hour,
              };
              index++;
            }
          })
        );

        // Update the registed_courses field in course_taken_history document
        if (courseTakenHistoryDoc.exists()) {
          await setDoc(
            courseTakenHistoryRef,
            {
              registed_courses: registedCoursesData,
            },
            { merge: true }
          ); // Merge option ensures existing data is not overwritten
        } else {
          await setDoc(courseTakenHistoryRef, {
            student_id: rowData.id,
            registed_courses: registedCoursesData,
          });
        }

        await setDoc(doc(firestore, "student_registed_course", rowData.id), {
          student_id: rowData.id,
          registed_courses: registed_course,
        });

        await deleteDoc(doc(firestore, "pending_register_course", rowData.id));
        // await setDoc(doc(firestore, "student_registed_course", rowData.id), {
        //   student_id: rowData.id,
        //   registed_course: registed_course,
        // });

        // const studentRef = doc(firestore, "students", rowData.id);
        // const studentRegistedCourseRef = doc(
        //   studentRef,
        //   "student_registed_course",
        //   rowData.id
        // );

        // await setDoc(studentRegistedCourseRef, {
        //   student_id: rowData.id,
        //   registed_course: registed_course,
        // });

        await Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "Approve student register course successful!",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          fetchData();
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error: " + error.message + "Please try again.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
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
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      const rowIndex = dataTable.row($(this).closest("tr")).index();
      const rowData = dataTable.row(rowIndex).data();
      try {
        Swal.fire({
          title: "Processing",
          text: "Rejecting student courses request, please wait...",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        await deleteDoc(doc(firestore, "pending_register_course", rowData.id));

        // Show a success alert using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "Reject course resgister successful!",
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
        const studentId = $(this)
          .closest("tr")
          .find("td:nth-child(2)")
          .text()
          .trim();
        const studentName = $(this)
          .closest("tr")
          .find("td:nth-child(3)")
          .text()
          .trim();
        const courseRequest = $(this)
          .closest("tr")
          .find("td:nth-child(4)")
          .text()
          .trim()
          .split(",");
        return {
          studentId: studentId,
          studentName: studentName,
          courseRequest: courseRequest,
        };
      })
      .toArray();
    // console.log(selectedRows);

    if (selectedRows.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No rows selected",
        text: "Please select at least one row to approve.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } else {
      const result = await Swal.fire({
        title: "Confirm Approval",
        text: "Do you want to approve?",
        icon: "question",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "Yes, approve!",
        cancelButtonText: "Cancel",
      });

      try {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Processing",
            text: "Approving student course request, please wait...",
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });

          // Loop through selected rows and store data in Firestore
          for (const row of selectedRows) {
            const { ...studentData } = row;
            // console.log(row.studentId);
            await deleteDoc(
              doc(firestore, "pending_register_course", row.studentId)
            );
            await setDoc(
              doc(firestore, "student_registed_course", row.studentId),
              {
                student_id: row.studentId,
                registed_courses: row.courseRequest,
              }
            );

            const courseTakenHistoryRef = doc(
              firestore,
              "course_taken_history",
              row.studentId
            );
            const courseTakenHistoryDoc = await getDoc(courseTakenHistoryRef);
            let registedCoursesData = {};

            if (courseTakenHistoryDoc.exists()) {
              registedCoursesData =
                courseTakenHistoryDoc.data().registed_courses;
            }

            let index = Object.keys(registedCoursesData).length + 1;

            // Fetch course details for each new course in registed_course
            await Promise.all(
              row.courseRequest.map(async (courseStr) => {
                const [courseCode] = courseStr.split(" ");
                const courseDoc = await getDoc(
                  doc(firestore, "course", courseCode)
                );
                if (courseDoc.exists()) {
                  const courseData = courseDoc.data();
                  registedCoursesData[index] = {
                    course: courseStr,
                    credit_hours: courseData.credit_hour,
                  };
                  index++;
                }
              })
            );

            // Update the registed_courses field in course_taken_history document
            if (courseTakenHistoryDoc.exists()) {
              await setDoc(
                courseTakenHistoryRef,
                {
                  registed_courses: registedCoursesData,
                },
                { merge: true }
              ); // Merge option ensures existing data is not overwritten
            } else {
              await setDoc(courseTakenHistoryRef, {
                student_id: row.studentId,
                registed_courses: registedCoursesData,
              });
            }

            // // Fetch course details for each course in registed_course
            // await Promise.all(
            //   row.courseRequest.map(async (courseStr) => {
            //     const [courseCode] = courseStr.split(" ");
            //     const courseDoc = await getDoc(
            //       doc(firestore, "course", courseCode)
            //     );
            //     if (courseDoc.exists()) {
            //       const courseData = courseDoc.data();
            //       registedCoursesData[index] = {
            //         course: courseStr,
            //         credit_hours: courseData.credit_hour,
            //       };
            //       index++;
            //     }
            //   })
            // );

            // await setDoc(
            //   doc(firestore, "course_taken_history", row.studentId),
            //   {
            //     student_id: row.studentId,
            //     registed_courses: registedCoursesData,
            //   }
            // );
          }

          await Swal.fire({
            icon: "success",
            title: "Successful!",
            text: "Approve student register course successful!",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          }).then(() => {
            window.location.reload("/approvecourse");
          });
        }
      } catch (error) {
        // console.error("Error approving data:", error);
        Swal.fire({
          icon: "error",
          title: "Approve student course request failed",
          text:
            "An error occurred while approving the selected rows." +
            error.message,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleRejectSelected = async () => {
    const selectedRows = $(".rowCheckbox:checked")
      .map(function () {
        const studentId = $(this)
          .closest("tr")
          .find("td:nth-child(2)")
          .text()
          .trim();
        return studentId;
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
        allowOutsideClick: false,
        confirmButtonText: "Yes, reject!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Processing",
          text: "Approving student course request, please wait...",
          allowOutsideClick: false,
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
              text: "Rejecting student course request, please wait...",
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                Swal.showLoading();
              },
            });

            const pendingRegisteredCourseDocRef = doc(
              firestore,
              "pending_register_course",
              row
            );

            // Delete the document from the "pending" collection
            await deleteDoc(pendingRegisteredCourseDocRef);

            Swal.fire({
              icon: "success",
              title: "Reject student course request successful!",
              text: "Selected rows have been rejected.",
              allowOutsideClick: false,
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload("/approveaccount");
            });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Reject course failed",
              text:
                "An error occurred while rejecting the selected rows." +
                error.message,
              allowOutsideClick: false,
              confirmButtonText: "OK",
            });
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
    <div
      style={{
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "36px" }}>Approve Student Course</div>
        <div>
          <button
            onClick={handleApproveSelected}
            className="all_upper_button_style update_modal_button"
          >
            Approve Selected
          </button>
          <button
            onClick={handleRejectSelected}
            className="all_upper_button_style delete_modal_button"
          >
            Reject Selected
          </button>
        </div>
      </div>

      <table
        id="approveCourseDataTable"
        className="table table-bordered mx-auto"
      >
        <thead></thead>
        <tbody></tbody>
      </table>

      {showForm && (
        <ApproveCourseShowModal
          student_id={searchStudentData.student_id}
          student_name={searchStudentData.student_name}
          personal_email={searchStudentData.personal_email}
          phone_number={searchStudentData.phone_number}
          programme={searchStudentData.programme}
          specialization={searchStudentData.specialization}
          intake={searchStudentData.intake}
          open={showForm}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ApproveCourse;
