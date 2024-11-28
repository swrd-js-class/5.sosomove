import React from "react";
import { Outlet } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar.jsx";
import { Route, Routes } from "react-router-dom";
import AdminBCheck from "./AdminBCheck.jsx";
import AdminBList from "./AdminBList.jsx";
import AdminEdit from "./AdminEdit.jsx";



//관리자페이지
export default () => {

  return (
    <div class="flex flex-row">
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};