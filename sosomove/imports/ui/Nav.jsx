import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
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
            </li>
            <li>
              <Link to="/postDetail/testID">DÒetailPage</Link>
            </li>
            <li>
              <Link to="/postInsert">NotFound</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};