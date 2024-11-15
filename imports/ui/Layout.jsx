import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Nav from "./Nav.jsx";
import Footer from './Footer.jsx';
import '/client/main.css';

export default () => {

  const [showImage, setShowImage] = useState(true);
  const handleNavClick = () => {
    setShowImage(false);
  };

  return (
    <div>
      <Nav onNavClick={handleNavClick} />
      {showImage && (
        <>
          <div className="main-img">
            <img src="/img.jpg" alt="main_img" />
          </div>
          <div className="flex justify-center items-center">
            <button className="bg-blue-500 hover:bg-dangerActive text-white text-lg py-2.5 px-5 mr-2 mb-2 rounded-xl shadow-md hover:scale-110 transition duration-300">
              지금 시작하기
            </button>
          </div>
        </>

      )}
      <main>
        <Outlet /> {/* This will render the matched child route */}
      </main>
      <Footer />
    </div>
  );
};

