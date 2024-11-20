import React from "react";
import { Outlet } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar";


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