import React, { useEffect, useState } from "react";
import ThirdPartyCreateModal from "./ThirdPartyCreateModal";
import { getDocs, collection, firestore } from "../firebase";
import $ from "jquery";
import Swal from "sweetalert2";
import "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "../assets/utilities/Global_Design.css";
import "./ThirdParty.css";
import ManageIcon from "../assets/manage_icon.png";
import ThridPartyManageModal from "./ThridPartyManageModal";

function ThirdParty() {
  let dataTable;
  let thirdParty = [];

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showManageForm, setShowManageForm] = useState(false);
  const [thirdPartyData, setThirdPartyData] = useState([]);

  useEffect(() => {
    dataTable = $("#ThirdPartyDataTable").DataTable({
      destroy: true,
      data: thirdParty,
      columns: [
        { data: "title", title: "Third Party Title", width: "20%" },
        { data: "link", title: "Third Party Link", width: "40%" },
        {
          data: "id",
          title: "Manage",
          // render: function (data, type, row) {
          //   return `<button class="manageAction" style="display: block; margin: 0 auto";>Manage</button>`;
          // },
          render: function (data, type, row) {
            return (
              '<div class = "manageAction data_table_icon_background" ><img src="' +
              ManageIcon +
              '" alt="Your Icon" class="data_table_icon" /></div>'
            );
          },
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).css("text-align", "center");
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
          collection(firestore, "third_party")
        );
        thirdParty = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          thirdParty.push({
            id: doc.id,
            title: data.title,
            link: data.link,
          });
        });

        // Update DataTable with the fetched data
        dataTable.clear().rows.add(thirdParty).draw();

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

    $("#ThirdPartyDataTable").on("click", ".manageAction", manageActionHandler);

    return () => {
      $("#ThirdPartyDataTable").off(
        "click",
        ".manageAction",
        manageActionHandler
      );
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

    setThirdPartyData(rowData);
    setShowManageForm(true);
  };

  const closeManageModal = () => {
    setShowManageForm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: "32px" }}>Third Party</div>
        <button
          type="button"
          className="all_upper_button_style create_modal_button"
          onClick={openCreateModalbtn}
        >
          Add New Third Party
        </button>
      </div>

      <table id="ThirdPartyDataTable">
        <thead></thead>
        <tbody></tbody>
      </table>

      {showCreateForm && (
        <ThirdPartyCreateModal
          open={showCreateForm}
          onClose={closeCreateModal}
        />
      )}

      {showManageForm && (
        <ThridPartyManageModal
          id={thirdPartyData.id}
          title={thirdPartyData.title}
          link={thirdPartyData.link}
          open={showManageForm}
          onClose={closeManageModal}
        />
      )}
    </div>
  );
}

export default ThirdParty;
