import React from "react";


//회원가입
export default () => {
  return (
    <div>
      <p>
        소소이사에 오신걸 환영합니다.<br />
        아래 양식에 맞춰 회원가입을 진행해주세요.
      </p>

      <input type="text" placeholder="아이디" /><br />
      <input type="text" placeholder="비밀번호" /><br />

    </div>
  );
};