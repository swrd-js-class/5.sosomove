import React, { useState, useRef } from "react";
import { Accounts } from 'meteor/accounts-base';

//회원가입
export default () => {
  const refEmail = useRef(null);
  const refPassword = useRef(null);
  // const refUsername = useRef(null);
  // const refPhone = useRef(0);

  const [status, setStatus] = useState('none'); //일반회원인지 사업자회원인지 구별
  const [type, setType] = useState('none'); //용달사업자인지 헬퍼사업자인지 구별
  const [error, setError] = useState('');

  const handleButtonClick = (newStatus) => {
    console.log(newStatus);
    setStatus(newStatus);
  };
  // const handleBusinessTypeChange = (newType) => {
  //   console.log(newType);
  //   let type = newType;
  //   setType(newType);
  // };


  const handleSignup = (event) => {
    event.preventDefault();

    const email = refEmail.current.value;
    const password = refPassword.current.value;
    // const username = refUsername.current.value;
    // const phone = refPhone.current.value;

    // Accounts.createUser 메서드를 사용하여 회원가입
    Accounts.createUser({
      id: email,
      password: password,
      profile: {
        type: type,
        // username: username,
        // phone: phone,
        // company: {
        //   company_name:
        //     company_phone:
        //   ceo_name:
        //     address:
        //   business_number:
        //     business_certificate:
        //   call_number:
        //     confirm: false,
        // }
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
      <p>
        소소이사에 오신걸 환영합니다!!!<br />
        아래 양식에 맞춰 회원가입을 진행해주세요!!!<br />
        회원가입 정보 입력
      </p>
      <button onClick={() => handleButtonClick('general')}>일반회원</button><br />
      {status === 'general' &&
        <form onSubmit={handleSignup}>
          id(이메일 주소) <input type="email" ref={refEmail} /><br />
          비밀번호 <input type="password" ref={refPassword} /><br />
          {/* 이름 <input type="text" ref={refUsername} /><br />
          핸드폰 번호 <input type="number" ref={refPhone} /><br /> */}
          {error && <p>{error}</p>}
          <button type="submit">회원가입</button>
        </form>
      }
      <button onClick={() => handleButtonClick('business')}>사업자 회원</button><br />
      {status === 'business' &&
        <form onSubmit={handleSignup}>
          이메일 주소 <input type="email" ref={refEmail} /><br />
          비밀번호 <input type="password" ref={refPassword} /><br />
          <p>사업 업종을 선택해주세요</p>
          용달사업자 <input type="radio" name="type" value="1" onChange={() => handleButtonClick('b1')} />&nbsp;&nbsp;&nbsp;
          헬퍼사업자 <input type="radio" name="type" value="2" onChange={() => handleButtonClick('b2')} /><br />

          {/* 사업체명 <input type="text" ref={company_name} /><br />
          사업자등록번호 <input type="number" ref={business_certificate} /><br />
          대표자명 <input type="text" ref={ceo_name} /><br />
          핸드폰 번호 <input type="number" ref={refPhone} /><br />
          유선 번호 <input type="number" ref={call_number} /><br />
          주소 <input type="text" ref={address} /><br /> */}
          <button type="submit">회원가입</button>
        </form>
      }

    </div>
  );
};