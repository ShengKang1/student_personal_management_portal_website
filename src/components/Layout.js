import React from "react";
import { Link } from "react-router-dom";
import Avatar_Icon from "../assets/Avatar_Icon.png";
import Swal from "sweetalert2";
import "./Layout.css"; // Import your CSS file

// Can Design the Bar in here
const Layout = ({ children }) => {
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Confirm Logout",
      text: "Do you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Successful!",
        text: "Logged out successfully!",
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 2000,
      }).then(() => {
        // Redirect to the homepage
        window.location.href = "/";
      });
    } else {
      Swal.close();
    }
  };

  return (
    <div className="layout">
      <div className="sidebar">
        {/* <Link to="/accountdetails">Account</Link> */}
        <Link to="/accountdetails">
          <img style={{ width: "80%" }} src={Avatar_Icon} alt="Account" />
        </Link>
        <Link to="/approveaccount">Approve Account</Link>
        <Link to="/manageaccount">Manage Student Account</Link>
        <Link to="/course">Course</Link>
        <Link to="/registerform">Register Form</Link>
        <Link to="/approvecourse">Approve Course</Link>
        <Link to="/studentregisteredcourse">Student Registered Course</Link>
        <Link to="/timetable">Timetable</Link>
        <Link to="/thirdparty">Third Party</Link>
        <Link to="/news">News</Link>
        <div className="logout" onClick={handleLogout}>
          Log Out
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
