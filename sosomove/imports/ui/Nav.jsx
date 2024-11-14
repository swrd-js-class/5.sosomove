import React from "react";
import { Link } from "react-router-dom";

export default ({ onNavClick }) => {
  return (
    <>
      <header>
        <nav onClick={onNavClick}>
          <ul>
            <li>
<<<<<<< HEAD
              <Link to="/Login">로그인/</Link>
            </li>
            <li>
              <Link to="/">서비스/</Link>
            </li>
            <li>
              <Link to="/">견적요청/</Link>
            </li>
            <li>
              <Link to="/">내 견적 조회/</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
=======
              <Link to="/login" >로그인</Link>
>>>>>>> c59e217c9810d6c76e30424706822aafa38f288d
            </li>
            <li>
              <Link to="/service" >서비스</Link>
            </li>
            <li>
              <Link to="/Request" >견적요청</Link>
            </li>
            <li>
              <Link to="/postinsert/testID" >내 견적 조회</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};