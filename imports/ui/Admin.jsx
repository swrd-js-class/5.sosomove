import React from "react";
import { Outlet } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar.jsx";

//관리자페이지
export default () => {
  return (
    <div class="flex min-h-screen border">
      <div>
        <AdminNavbar class="flex h-full" />
      </div>
      <div class="flex-1 h-full">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};