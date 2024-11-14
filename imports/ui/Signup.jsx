import React, { useState, useRef } from "react";
import { Accounts } from 'meteor/accounts-base';

//회원가입
export default () => {

  const [selectedContent, setSelectedContent] = useState('none');
  const handleButtonClick = (content) => {
    setSelectedContent(content);
  };

  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const refEmail = useRef(null);
  const refPhone = useRef(0);
  const [error, setError] = useState('');


  const handleSignup = (event) => {
    event.preventDefault();

    const username = refUsername.current.value;
    const password = refPassword.current.value;
    const email = refEmail.current.value;
    const phone = refPhone.current.value;



    // Meteor의 Accounts.createUser 메서드를 사용하여 회원가입
    Accounts.createUser({
      username: username,
      password: password,
      email: email,
      profile: {
        phone: phone,
      }
    }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        alert('회원가입 성공!');
      }
    }
    );

  };

  return (
    <div>
      <p><b>
        소소이사에 오신걸 환영합니다!!!<br />
        아래 양식에 맞춰 회원가입을 진행해주세요!!!<br />
        회원가입 정보 입력
      </b></p>
      <button onClick={() => handleButtonClick('first')}>일반회원</button><br />
      {selectedContent === 'first' &&
        <form onSubmit={handleSignup}>
          이름 <input type="text" ref={refUsername} placeholder="이름" /><br />
          비밀번호 <input type="password" ref={refPassword} placeholder="비밀번호" /><br />
          이메일 주소 <input type="email" ref={refEmail} placeholder="아이디" /><br />
          핸드폰 번호 <input type="number" ref={refPhone} placeholder="핸드폰 번호" /><br />
          {error && <p>{error}</p>}
          <button type="submit">회원가입</button>
        </form>
      }
      <button onClick={() => handleButtonClick('second')}>사업자 회원</button><br />
      {selectedContent === 'second' &&
        <form onSubmit={handleSignup}>
          <label>
            용달사업자 <input type="radio" name="type" value="1" />&nbsp;&nbsp;&nbsp;
          </label>
          <label>
            헬퍼사업자 <input type="radio" name="type" value="2" /><br />
          </label>
          사업체명 <input type="text" placeholder="사업체명" /><br />
          비밀번호 <input type="password" placeholder="비밀번호" /><br />
          이메일 주소 <input type="email" placeholder="이메일" /><br />
          대표자명 <input type="text" placeholder="대표자명" /><br />
          유선 번호 <input type="number" placeholder="유선 번호" /><br />
          핸드폰 번호 <input type="number" placeholder="핸드폰 번호" /><br />
          주소 <input type="text" placeholder="주소" /><br />
          사업자등록번호 <input type="number" placeholder="사업자등록번호" /><br />
          <button type="submit">회원가입</button>
        </form>
      }

    </div>
  );
};