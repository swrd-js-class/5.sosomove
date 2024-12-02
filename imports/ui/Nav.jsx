import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

//위쪽 네비게이션
export default ({ onNavClick }) => {

  useTracker(() => Meteor.user());
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  const handleLogout = () => {
    Meteor.logout(() => {
      alert('로그아웃 되었습니다');
      navigate('/');
    });
  };

  return (
    <header>
      <nav class="lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2" onClick={onNavClick}>
        {/* 소소이사 로고 */}
        <div class="flex-1 flex justify-between items-center">
          <a href="/" class="flex text-lg font-semibold">
            <img src="/logo.png" width="80" height="80" class="p-2" alt="로고이미지" />
            <div class="mt-6 text-red-600 text-center">소소이사</div>
          </a>
        </div>
        <label htmlFor="menu-toggle" class="cursor-pointer lg:hidden block">
          <svg class="fill-current text-gray-900" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>
        <input class="hidden" type="checkbox" id="menu-toggle" checked={menuOpen} onChange={handleMenuToggle} />
        <div class={`${menuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto w-full`} id="menu">
          <nav>
            <ul class="text-sm text-center items-center gap-x-5 pt-4 md:gap-x-4 lg:text-lg lg:flex  lg:pt-0">
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
                <Link to="/service" >서비스</Link>
              </li>
              <li class="py-2 lg:py-0 ">
                <Link to="/gpt" >포장도우미AI</Link>
              </li>
              <li class="py-2 lg:py-0 ">
                <Link to="/mypage" >마이페이지(송희)</Link>
              </li>
              <li class="py-2 lg:py-0 ">
                <Link to="/business" >마이페이지(희원)</Link>
              </li>
              <li class="py-2 lg:py-0 ">
                <Link to="/admin" >관리자페이지</Link>
              </li>
              <li class="py-2 lg:py-0 ">
                <Link to="/ttt" >테스트용(효정)</Link>
              </li>

            </ul>
          </nav>
        </div>
      </nav>
    </header>
  );
};
