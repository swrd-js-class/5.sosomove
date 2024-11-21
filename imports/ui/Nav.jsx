import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';


export default ({ onNavClick }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  const handleLogout = () => {
    Meteor.logout(() => {
      alert('로그아웃 되었습니다');
      navigate('/');
      // 페이지를 새로고침하여 스타일과 리소스 문제 해결
      window.location.reload(); //강제 페이지 리로드 
    });
  };


  return (
    <nav class="lg:px-16 px-6 bg-white shadow-md flex flex-wrap items-center lg:py-0 py-2" onClick={onNavClick}>
      {/* 소소이사 로고 */}
      <div class="flex-1 flex justify-between items-center">
        <a href="/" class="flex text-lg font-semibold">
          {/* <img src="/logo.png" width="50" height="50" class="p-2" alt="Logo" /> */}
          <div class="mt-3 text-red-600">소소이사</div>
        </a>
      </div>
      <label htmlFor="menu-toggle" class="cursor-pointer lg:hidden block">
        <svg
          class="fill-current text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <title>menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </label>
      <input class="hidden" type="checkbox" id="menu-toggle" checked={menuOpen} onChange={handleMenuToggle} />
      <div class={`${menuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto w-full`} id="menu">
        <nav>
          <ul class="text-xl text-center items-center gap-x-5 pt-4 md:gap-x-4 lg:text-lg lg:flex  lg:pt-0">
            {Meteor.user() ? (
              <li class="py-2 lg:py-0 ">
                <button onClick={handleLogout} >로그아웃</button>
              </li>
            ) : (
              <li class="py-2 lg:py-0 ">
                <Link to="/login" >로그인</Link>
              </li>
            )}
            <li class="py-2 lg:py-0 ">
              <Link to="/signup" >회원가입</Link>
            </li>
            <li class="py-2 lg:py-0 ">
              <Link to="/request" >테스트(효정)</Link>
            </li>
            <li class="py-2 lg:py-0 ">
              <Link to="/allrequest" >사업자 견적요청 조회(희원)</Link>
            </li>
            <li>
              <Link to="/admin" >관리자페이지(효정)</Link>
            </li>
            <li class="py-2 lg:py-0 ">
              <Link to="/checkrequest" >견적서 조회(송희)</Link>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );

};
