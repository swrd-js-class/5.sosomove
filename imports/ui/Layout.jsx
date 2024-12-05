import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from "./Nav.jsx";
import Footer from './Footer.jsx';
import { useNavigate } from 'react-router-dom';


//메인페이지 레이아웃
export default () => {

  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(true);
  const handleNavClick = () => {
    setShowImage(false);
  };
  const handleStartClick = () => {
    setShowImage(false);
    navigate('/signup');
  };
  // 페이지 로드 시 이미지가 보이도록 설정
  useEffect(() => {
    if (location.pathname === '/') {
      setShowImage(true);  // 레이아웃 페이지로 돌아왔을 때만 이미지 표시
    }
  }, [location.pathname]);


  return (
    <div>
      <Nav onNavClick={handleNavClick} />
      {showImage && (
        <div>
          <div>
            <img src="/img.jpg" alt="메인이미지" className="main-img" />
          </div>
          <div class="flex justify-center items-center">
            <button class="bg-indigo-500 hover:bg-dangerActive text-white text-lg py-2.5 px-5 mr-2 mb-20 rounded-xl hover:scale-110 transition duration-300" onClick={handleStartClick}>
              소소이사 시작하기
            </button>
          </div>
        </div>
      )}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

