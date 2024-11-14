import React, { useEffect, useRef, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

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
          <input ref={refUsername} type="text" placeholder="이메일을 입력하세요" />
          <input ref={refPassword} type="password" placeholder="비밀번호를 입력하세요" /><br />
          <button onClick={handleLogin}>로그인</button>
          <button>회원가입</button>
        </div>
      )}
    </div>
  );
};