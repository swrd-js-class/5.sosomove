import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from "./Nav.jsx";
import Footer from './Footer.jsx';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(true);
  const handleNavClick = () => {
    setShowImage(false);
  };
  const handleClick = () => {
    setShowImage(false);
    navigate('/signup');
  };

  return (
    <div>
      <Nav onNavClick={handleNavClick} />
      {showImage && (
        <>
          {/* <div className="main-img">
            <img src="/img.jpg" alt="main_img" />
          </div> */}
          <div className="flex justify-center items-center">
            <button className="bg-blue-500 hover:bg-dangerActive text-white text-lg py-2.5 px-5 mr-2 mb-20 rounded-xl shadow-md hover:scale-110 transition duration-300" onClick={handleClick}>
              소소이사 시작하기
            </button>
          </div>
        </>
      )}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

