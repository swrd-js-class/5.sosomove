import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import { useTracker } from "meteor/react-meteor-data";

import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Nav from "./Nav.jsx";
import PostDetail from "./PostDetail.jsx";
import Signup from "./Signup.jsx";




export const App = () => {

  useTracker(() => {
    return [Meteor.user()];


  })

  const refUsername = useRef(null);
  const refPassword = useRef(null);

  const handleLogin = () => {
    const rslt = Meteor.loginWithPassword(
      refUsername.current.value,
      refPassword.current.value
    );
    console.log(rslt);
  };




  return (
    <div>
      {Meteor.user() ? (
        <div>
          <button
            onClick={() => {
              Meteor.logout();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <div>
            소소이사
          </div>
        </div>
      )}
      <div className="navigation">
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/postDetail/:_id" element={<PostDetail></PostDetail>}></Route>
            <Route path="*" element={<NotFound />}></Route>
            <Route path="/Login" element={<Login />}></Route>
            <Route path="/Signup" element={<Signup />}></Route>
          </Routes>
        </Router>
      </div>

      <div>
        <img src="/img.jpg" alt="main_image" className="fullscreen-img" />
      </div>
      <div>
        <button>지금 시작하기</button>
      </div>

    </div>
  );

};

=======
import '/client/main.css';

import Layout from './Layout';
import Login from "./Login.jsx";
import Service from "./Service.jsx";
import Request from "./Request.jsx";
import Postinsert from "./Postinsert.jsx";
import NotFound from "./NotFound.jsx";


export const App = () => (
  < Router >
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<Service />} />
        <Route path="/request" element={<Request />} />
        <Route path="/postinsert/:_id" element={<Postinsert></Postinsert>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Router >
);



>>>>>>> c59e217c9810d6c76e30424706822aafa38f288d
