import React from "react";
import { Outlet } from 'react-router-dom';
import BusinessMypageNavbar from "./BusinessMypageNavbar.jsx";

//마이페이지-사업자
export default () => {
  return (
    <div class="flex min-h-screen border">
      <div>
        <BusinessMypageNavbar class="flex h-full" />
      </div>
      <div class="flex-1 h-full">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};