import React from "react";
import { Outlet } from 'react-router-dom';
import MypageNavbar from "./MypageNavbar.jsx";

//마이페이지-일반회원
export default () => {
  return (
    <div className="flex min-h-screen border">
      <div >
        <MypageNavbar className="flex h-full" />
      </div>
      <div className="flex-1 h-full">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
