import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

//위쪽 네비게이션
export default ({ onNavClick }) => {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useTracker(() => Meteor.user());

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
      <nav className="lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2" onClick={onNavClick}>
        <div className="flex-1 flex justify-between items-center">
          <a href="/" className="flex text-lg font-semibold">
            <img src="/logo.png" width="50" height="50" className="p-2" alt="로고이미지" />
            <div className="flex items-center justify-center text-red-600 text-center dongle-regular pt-2">소소이사</div>
          </a>
        </div>
        <label htmlFor="menu-toggle" className="cursor-pointer lg:hidden block">
          <svg className="fill-current text-gray-900" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>
        <input className="hidden" type="checkbox" id="menu-toggle" checked={menuOpen} onChange={handleMenuToggle} />
        <div className={`${menuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto w-full`} id="menu">
          <nav>
            <ul className="text-xs text-center items-center gap-x-5 pt-4 md:gap-x-4 lg:text-lg lg:flex lg:pt-0">
              {user ? (
                <li className="py-2 lg:py-0 text-gray-700 hover:text-black hover:font-bold ">
                  <button onClick={handleLogout} >로그아웃</button>
                </li>
              ) : (
                <li className="py-2 lg:py-0 text-gray-700 hover:text-black hover:font-bold">
                  <Link to="/login" >로그인</Link>
                </li>
              )}
              <li className="py-2 lg:py-0 text-gray-700 hover:text-black hover:font-bold ">
                <Link to="/signup" >회원가입</Link>
              </li>
              <li className="py-2 lg:py-0 text-gray-700 hover:text-black hover:font-bold ">
                <Link to="/service" >서비스</Link>
              </li>
              {user && user.profile && user.profile.type === '관리자' && (
                <li className="py-2 lg:py-0 text-gray-700 hover:text-black hover:font-bold">
                  <Link to="/admin">관리자페이지</Link>
                </li>
              )}
              {user && user.profile && user.profile.type === '일반' && (
                <li className="py-2 lg:py-0 text-gray-700 hover:text-black hover:font-bold">
                  <Link to="/mypage">마이페이지</Link>
                </li>
              )}
              {(
                (user && user.profile && user.profile.type === '용달' && user.profile.company.confirm == true) ||
                (user && user.profile && user.profile.type === '헬퍼' && user.profile.company.confirm == true)
              ) && (
                  <li className="py-2 lg:py-0 text-gray-700 hover:text-black hover:font-bold">
                    <Link to="/business">마이페이지</Link>
                  </li>
                )}
              <li className="relative group">
                <span className="cursor-pointer text-gray-700 hover:text-black hover:font-bold">이사도우미AI</span>
                <ul className="absolute left-0 opacity-0 invisible mt-2 space-y-1 bg-gray-200 text-black border rounded-lg group-hover:opacity-100 group-hover:visible group-hover:block transition-all duration-[300ms] ease-in-out">
                  <li className="block px-4 py-2 text-sm text-gray-900 hover:text-black hover:font-bold"><Link to="/gpt" >포장search</Link></li>
                  <li className="block px-4 py-2 text-sm text-gray-900 hover:text-black hover:font-bold"><Link to="/ttt" >이삿짐scan</Link></li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </nav>
    </header>
  );
};
