import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './Layout';
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Request from "./Request.jsx";
import Signup from "./Signup.jsx";
import Postinsert from "./Postinsert.jsx";
import NotFound from "./NotFound.jsx";
import Checkrequest from "./CheckRequest.jsx";
import DatePickerComponent from '../publicAPI/Calendar.jsx';

export const App = () => (
  < Router >
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<Service />} />
        <Route path="/request" element={<Request />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/postinsert/:_id" element={<Postinsert></Postinsert>} />
        <Route path="/checkrequest" element={<Checkrequest />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    <div>
      {/* <DatePickerComponent /> 달력 컴포넌트 삽입 */}
    </div>
  </Router>
);



