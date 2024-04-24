import React, { useState, useEffect, useRef } from "react";
import { getDocs, collection, firestore } from "../firebase";
import NewsCreateModal from "./NewsCreateModal";
import $ from "jquery";
import Swal from "sweetalert2";
import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import ManageIcon from "../assets/manage_icon.png";
import "./News.css";
import NewsManageModal from "./NewsManageModal";

function News() {
  let dataTable;
  let news = [];
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [allNewsData, setAllNewsData] = useState([]);
  const allNewsRef = useRef(allNewsData);

  useEffect(() => {
    const getLatestInfo = async () => {
      const querySnapshot = await getDocs(collection(firestore, "news"));
      const allData = querySnapshot.docs.map((val) => ({
        ...val.data(),
        id: val.id,
      }));

      setAllNewsData(allData);
      // console.log("Data: ", allData);
    };

    getLatestInfo();
  }, []);

  useEffect(() => {
    // console.log("Run!");
    allNewsRef.current = allNewsData;
    // console.log(studentInfoRef);
  }, [allNewsData]);

  useEffect(() => {
    dataTable = $("#NewsDataTable").DataTable({
      destroy: true,
      data: news,
      columns: [
        { data: "title", title: "Content" },
        { data: "content", title: "Title" },
        { data: "date", title: "Create Date" },
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
        const querySnapshot = await getDocs(collection(firestore, "news"));
        news = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const dateObject = data.createdAt.toDate();

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
          const date = formatDate(dateObject);
          const time = formatTime(dateObject);

          news.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            date: date,
            time: time,
          });
        });

        // Update DataTable with the fetched data
        dataTable.clear().rows.add(news).draw();

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

    fetchData();

    $("#NewsDataTable").on("click", ".manageAction", manageActionHandler);

    return () => {
      $("#NewsDataTable").off("click", ".manageAction", manageActionHandler);
    };
  }, []);

  const openCreateModalbtn = () => {
    setShowCreateForm(true);
  };

  const closeCreateModal = () => {
    setShowCreateForm(false);
  };

  const manageActionHandler = async function (event) {
    const rowIndex = dataTable.row($(this).closest("tr")).index();
    const rowData = dataTable.row(rowIndex).data();

    setNewsData(rowData);
    setShowManageForm(true);
  };

  const closeManageModal = () => {
    setShowManageForm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "32px" }}>News</div>
        <button
          type="button"
          className="all_upper_button_style create_modal_button"
          onClick={openCreateModalbtn}
        >
          Add New News
        </button>
      </div>

      <table id="NewsDataTable">
        <thead></thead>
        <tbody></tbody>
      </table>

      {showCreateForm && (
        <NewsCreateModal open={showCreateForm} onClose={closeCreateModal} />
      )}

      {showManageForm && (
        <NewsManageModal
          id={newsData.id}
          allData={allNewsRef}
          open={showManageForm}
          onClose={closeManageModal}
        />
      )}
    </div>
  );
}

export default News;
