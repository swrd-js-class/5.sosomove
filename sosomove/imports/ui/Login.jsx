<<<<<<< HEAD
import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useRef, useState } from "react";

export default () => {

  useTracker(() => {
    return [Meteor.user()];
  })
=======
import React, { useEffect, useRef, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

export default () => {
  useTracker(() => {
    return [Meteor.user()];
  });
>>>>>>> c59e217c9810d6c76e30424706822aafa38f288d

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
<<<<<<< HEAD
    <div className="login-box">
      <input type="text" placeholder="아이디" />
      <input type="text" placeholder="비밀번호" /><br />
      <button onClick={handleLogin}>로그인</button>
      <button>회원가입</button>
    </div>


=======
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
          <input ref={refUsername} type="text" placeholder="이메일을 입력하세요" />
          <input ref={refPassword} type="text" placeholder="비밀번호를 입력하세요" /><br />
          <button onClick={handleLogin}>로그인</button>
          <button>회원가입</button>
        </div>
      )}
    </div>
>>>>>>> c59e217c9810d6c76e30424706822aafa38f288d
  );
};