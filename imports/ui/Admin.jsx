import React from "react";
import { Outlet } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar.jsx";

//관리자페이지
export default () => {

  return (
    <div>
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};