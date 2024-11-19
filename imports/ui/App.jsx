import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './Layout';
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Request from "./Request.jsx";
import Signup from "./Signup.jsx";
import SignupDetail from "./SignupDetail.jsx";
import NotFound from "./NotFound.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import AdminBCheck from "./AdminBCheck.jsx";
import AdminBList from "./AdminBList.jsx";
import Admin from "./Admin.jsx";


export const App = () => (
  < Router >
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<Service />} />
        <Route path="/request" element={<Request />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminbcheck" element={<AdminBCheck />} />
        <Route path="/adminblist" element={<AdminBList />} />
        <Route path="/adminnavbar" element={<AdminNavbar />} />
        <Route path="/signupdetail/:userType" element={<SignupDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Router>
);



