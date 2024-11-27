import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Gpt from "./Gpt.jsx";
import Signup from "./Signup.jsx";
import BusinessEst from "./BusinessEst.jsx";
import Admin from "./Admin.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import AdminBCheck from "./AdminBCheck.jsx";
import AdminBList from "./AdminBList.jsx";
import AdminEdit from "./AdminEdit.jsx";
import SignupDetail from "./SignupDetail.jsx";
import NotFound from "./NotFound.jsx";
import Checkrequest from "./CheckRequest.jsx";
import AllRequest from "./AllRequest.jsx";
import BusinessAllRequestDetails from "./BusinessAllRequestDetails.jsx";
import BusinessAllEstimate from "./BusinessAllEstimate.jsx";
import RequestDetail from "./RequestDetail.jsx";
import NewRequest from "./NewRequest.jsx";
import MatchingDetail from "./MatchingDetail.jsx";
import MypageNavbar from "./MypageNavbar.jsx";
import UserEdit from "./UserEdit.jsx";
import BusinessEdit from "./BusinessEdit.jsx";
import Layout from "./Layout.jsx";


export const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/login" element={<Login />} />
          <Route path="/service" element={<Service />} />
          <Route path="/gpt" element={<Gpt />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminnavbar" element={<AdminNavbar />} /> */
          <Route path="/adminbcheck" element={<AdminBCheck />} />
          <Route path="/adminblist" element={<AdminBList />} />
          <Route path="/adminedit" element={<AdminEdit />} />
          <Route path="/allrequest" element={<AllRequest />} />
          <Route path="/businessestimate/:id" element={<BusinessEst />} />
          <Route path="/request-details/:id" element={<BusinessAllRequestDetails />} />
          <Route path="/businessAllEstimate" element={<BusinessAllEstimate />} />
          <Route path="/signupdetail/:userType" element={<SignupDetail />} />
          <Route path="/checkrequest" element={<Checkrequest />} />
          <Route path="/requestdetail/:id" element={<RequestDetail />} />
          <Route path="/NewRequest" element={<NewRequest />} />
          <Route path="/MatchingDetail" element={<MatchingDetail />} />
          <Route path="/useredit" element={<UserEdit />} />
          <Route path="/businessedit" element={<BusinessEdit />} />
          <Route path="/MypageNavbar" element={<MypageNavbar />} />






          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
};



