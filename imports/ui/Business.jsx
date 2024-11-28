import React from "react";
import { Outlet } from 'react-router-dom';
import BusinessMypageNavbar from "./BusinessMypageNavbar.jsx";


//마이페이지-사업자
export default () => {

  return (
    <div class="flex flex-row">
      <BusinessMypageNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};