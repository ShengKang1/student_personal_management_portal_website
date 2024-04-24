import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ApproveAccount from "./page/ApproveAccount";
import Login from "./page/Login";
import Layout from "./components/Layout";
import Register from "./page/Register";
import AccountDetails from "./page/AccountDetails";
import ManageAccount from "./page/ManageAccount";
import ApproveCourse from "./page/ApproveCourse";
import CreateCourseTimetable from "./page/CreateCourseTimetable";
import ThirdParty from "./page/ThirdParty";
import Course from "./page/Course";
import RegisterForm from "./page/RegisterForm";
import News from "./page/News";
import Timetable from "./page/Timetable";
import StudentRegisteredCourse from "./page/StudentRegisteredCourse";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/layout" element={<Layout />} />
        <Route path="/approveaccount" element={<ApproveAccount />} /> */}

        {/* Let the content to right side */}
        <Route
          path="/accountdetails"
          element={
            <Layout>
              <AccountDetails />
            </Layout>
          }
        />
        <Route
          path="/approveaccount"
          element={
            <Layout>
              <ApproveAccount />
            </Layout>
          }
        />
        <Route
          path="/manageaccount"
          element={
            <Layout>
              <ManageAccount />
            </Layout>
          }
        />
        <Route
          path="/course"
          element={
            <Layout>
              <Course />
            </Layout>
          }
        />
        <Route
          path="/registerform"
          element={
            <Layout>
              <RegisterForm />
            </Layout>
          }
        />
        <Route
          path="/approvecourse"
          element={
            <Layout>
              <ApproveCourse />
            </Layout>
          }
        />
        <Route
          path="/studentregisteredcourse"
          element={
            <Layout>
              <StudentRegisteredCourse />
            </Layout>
          }
        />
        <Route
          path="/timetable"
          element={
            <Layout>
              <Timetable />
            </Layout>
          }
        />
        <Route
          path="/thirdparty"
          element={
            <Layout>
              <ThirdParty />
            </Layout>
          }
        />
        <Route
          path="/news"
          element={
            <Layout>
              <News />
            </Layout>
          }
        />
        {/* <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
