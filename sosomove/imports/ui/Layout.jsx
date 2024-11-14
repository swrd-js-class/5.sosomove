import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from "./Nav.jsx";
import Footer from './Footer.jsx';
import '/client/main.css';
import { useNavigate } from 'react-router-dom';

export default () => {
  const [showImage, setShowImage] = useState(true);
  const handleNavClick = () => {
    setShowImage(false);
  };

  const navigate = useNavigate();
  const handleStartButton = () => {
    navigate('/login');
  };

  return (
    <div>
      소소이사
      <Nav onNavClick={handleNavClick} />
      {showImage && (
        <div>
          <img src="/img.jpg" alt="main_img" className="main-imae" />
          <button onClick={handleStartButton}>지금 시작하기</button>
        </div>
      )}
      <main>
        <Outlet /> {/* This will render the matched child route */}
      </main>
      <Footer />
    </div>
  );
};

