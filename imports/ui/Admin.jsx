import React from "react";
import { Outlet } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar.jsx";

//관리자페이지
export default () => {
  return (
    <div className="flex min-h-screen border">
      <div>
        <AdminNavbar className="flex h-full" />
      </div>
      <div className="flex-1 h-full">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};