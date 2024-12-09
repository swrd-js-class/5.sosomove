import React from "react";
import { Outlet } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar.jsx";

//관리자페이지
export default () => {
  return (
    <div class="flex flex-row border h-screen">
      <AdminNavbar />
      <div class="flex flex-1 bg-indigo-200">
        <main class=" mt-8 ml-10 " >
          <Outlet />
        </main>
      </div>
    </div>
  );
};