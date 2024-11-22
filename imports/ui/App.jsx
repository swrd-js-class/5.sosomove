import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './Layout';
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Request from "./Request.jsx";
import Signup from "./Signup.jsx";
import BusinessEst from "./BusinessEst.jsx";
import Admin from "./Admin.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import AdminBCheck from "./AdminBCheck.jsx";
import AdminBList from "./AdminBList.jsx";
import SignupDetail from "./SignupDetail.jsx";
import NotFound from "./NotFound.jsx";
import Checkrequest from "./CheckRequest.jsx";
import AllRequest from "./AllRequest.jsx";
import BusinessAllRequestDetails from "./BusinessAllRequestDetails.jsx";
import RequestDetail from "./RequestDetail.jsx";
import NewRequest from "./NewRequest.jsx";
import DatePickerComponent from '../publicAPI/Calendar.jsx';
import MypageNavbar from "./MypageNavbar.jsx";

export const App = () => {
  return (
    < Router >
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/login" element={<Login />} />
          <Route path="/service" element={<Service />} />
          <Route path="/request" element={<Request />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminnavbar" element={<AdminNavbar />} />
          <Route path="/adminbcheck" element={<AdminBCheck />} />
          <Route path="/adminblist" element={<AdminBList />} />
          <Route path="/allrequest" element={<AllRequest />} />
          <Route path="/businessestimate/:id" element={<BusinessEst />} />
          <Route path="/request-details/:id" element={<BusinessAllRequestDetails />} />
          <Route path="/signupdetail/:userType" element={<SignupDetail />} />
          <Route path="/checkrequest" element={<Checkrequest />} />
          <Route path="/requestdetail/:id" element={<RequestDetail />} />
          <Route path="/NewRequest" element={<NewRequest />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <div>
        {/* <DatePickerComponent /> 달력 컴포넌트 삽입 */}
      </div>
    </Router>
  )
};



