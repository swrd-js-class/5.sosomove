import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useRef, useState } from "react";

export default () => {

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
    <div className="login-box">
      <input type="text" placeholder="아이디" />
      <input type="text" placeholder="비밀번호" /><br />
      <button onClick={handleLogin}>로그인</button>
      <button>회원가입</button>
    </div>


  );
};