import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import '/client/main.css';

import Layout from './Layout';
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Request from "./Request.jsx";
import Postinsert from "./Postinsert.jsx";
import NotFound from "./NotFound.jsx";


export const App = () => (
  < Router >
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<Service />} />
        <Route path="/request" element={<Request />} />
        <Route path="/postinsert/:_id" element={<Postinsert></Postinsert>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Router >
);



