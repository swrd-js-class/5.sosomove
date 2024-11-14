import React from "react";
import { Link } from "react-router-dom";

export default ({ onNavClick }) => {
  return (
    <>
      <header>
        <nav onClick={onNavClick}>
          <ul>
            <li>
              <Link to="/login" >로그인</Link>
            </li>
            <li>
              <Link to="/signup" >회원가입</Link>
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