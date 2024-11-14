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
      소소이사(로고)
      <div className='navbox'>
        <Nav onNavClick={handleNavClick} />
      </div>
      {showImage && (
        <div>
          <img src="/img.jpg" alt="main_img" className="main-img" />
        </div>
      )}
      <main>
        <Outlet /> {/* This will render the matched child route */}
      </main>
      <Link to="/signup">지금 시작하기</Link>
      <Footer />
    </div>
  );
};

