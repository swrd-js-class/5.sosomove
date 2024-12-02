import React from "react";
import { Outlet } from 'react-router-dom';
import MypageNavbar from "./MypageNavbar.jsx";

//마이페이지-일반회원
export default () => {
  return (
    <div class="flex flex-row border h-[100vh]">
      <MypageNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};