import React, { useEffect, useRef, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from 'react-router-dom';

//로그인
export default () => {

  useTracker(() => {
    return [Meteor.user()];
  });

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
            로그아웃
          </button>
        </div>
      ) : (
        <div>
          ID <input ref={refUsername} type="text" placeholder="이메일을 입력하세요" /><br />
          PASSWORD <input ref={refPassword} type="password" placeholder="비밀번호를 입력하세요" /><br />
          <button onClick={handleLogin}>로그인</button>
          <Link to="/signup">회원가입</Link>
        </div>
      )}
    </div>
  );
};