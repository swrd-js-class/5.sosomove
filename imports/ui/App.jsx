import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './Layout';
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Request from "./Request.jsx";
import Signup from "./Signup.jsx";
import Admin from "./Admin.jsx";
import SignupDetail from "./SignupDetail.jsx";
import Postinsert from "./Postinsert.jsx";
import NotFound from "./NotFound.jsx";
import Checkrequest from "./CheckRequest.jsx";
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
          <Route path="/signupdetail/:userType" element={<SignupDetail />} />
          <Route path="/postinsert/:_id" element={<Postinsert></Postinsert>} />
          <Route path="/checkrequest" element={<Checkrequest />} />
          <Route path="/requestdetail:_id" element={<RequestDetail />} />
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



