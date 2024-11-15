import React, { useState, useRef } from "react";
import { Accounts } from 'meteor/accounts-base';

//회원가입
export default () => {
  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refUsername = useRef(null);
  const refPhone = useRef(0);
  //사업자회원일 경우
  const company_name = useRef(null);
  const company_phone = useRef(0);
  const ceo_name = useRef(null);
  const address = useRef(null);
  const business_number = useRef(0);
  const business_certificate = useRef(0);
  const call_number = useRef(0);

  //일반회원과 사업자회원 구별
  const [status, setStatus] = useState('none');
  //용달사업자와 헬퍼사업자 구별 
  const [type, setType] = useState('none');
  const [error, setError] = useState('');

  const handleButtonClick = (e) => {
    setStatus(e);
  };
  const handleBusinessType = (e) => {
    setType(e);
  };
  const handleSignup = (event) => {
    event.preventDefault();
    const email = refEmail.current.value;
    const password = refPassword.current.value;
    const name = refUsername.current.value;
    const phone = refPhone.current.value;
    // 사업자회원은 회원가입시 company에 추가 정보가 필요함
    let company = null;
    if (status === 'business') {
      company = {
        company_name: company_name.current ? company_name.current.value : '',
        company_phone: company_phone.current ? company_phone.current.value : '',
        ceo_name: ceo_name.current ? ceo_name.current.value : '',
        address: address.current ? address.current.value : '',
        business_number: business_number.current ? business_number.current.value : null,
        business_certificate: business_certificate.current ? business_certificate.current.value : '',
        call_number: call_number.current ? call_number.current.value : null,
        confirm: false,
      };
    }

    //DB에 저장
    Accounts.createUser({
      username: email,
      password: password,
      profile: {
        type: status === '일반' ? '일반' : type,
        name: name,
        phone: phone,
        company: status === '사업자' ? company : null,
      }
    }, (err) => {
      if (err) {
        console.error(err);
        setError(err.reason);
      } else {
        setError('');
        alert('회원가입 되었습니다!');
      }
    }
    );
  };

  return (
    <div>
      <div class='flex items-center justify-center min-h-screen from-blue-100 via-blue-300 to-blue-500 bg-gradient-to-br'>
        <div class='w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl'>
          <div class='max-w-md mx-auto space-y-6'>
            <div class="space-y-4">
              <p class="text-lg font-medium text-center text-neutral-900">회원가입 정보 입력</p>
              <div class="relative">
                <input type="radio" name="options" id="option1-checkbox" value="1" class="hidden peer" />
                <label for="option1-checkbox" class="inline-flex items-center justify-between w-full p-5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50 hover:text-neutral-900 hover:border-neutral-300">
                  <div class="flex items-center space-x-5">
                    <svg class="w-16 h-auto" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M224 56v122.06l-39.72-39.72a8 8 0 0 0-11.31 0L147.31 164l-49.65-49.66a8 8 0 0 0-11.32 0L32 168.69V56a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8" opacity="0.2" /><path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v102.75l-26.07-26.06a16 16 0 0 0-22.63 0l-20 20l-44-44a16 16 0 0 0-22.62 0L40 149.37V56ZM40 172l52-52l80 80H40Zm176 28h-21.37l-36-36l20-20L216 181.38zm-72-100a12 12 0 1 1 12 12a12 12 0 0 1-12-12" /></g></svg>
                    <div class="flex flex-col justify-start">
                      <div class="w-full text-lg font-semibold" >일반회원</div>
                    </div>
                  </div>
                </label>
              </div>
              <div class="relative">
                <input type="radio" name="options" id="option2-checkbox" value="2" class="hidden peer" />
                <label for="option2-checkbox" class="inline-flex items-center justify-between w-full p-5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50 hover:text-neutral-900 hover:border-neutral-300">
                  <div class="flex items-center space-x-5">
                    <svg class="w-16 h-auto" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="currentColor"><path d="M224 56v122.06l-39.72-39.72a8 8 0 0 0-11.31 0L147.31 164l-49.65-49.66a8 8 0 0 0-11.32 0L32 168.69V56a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8" opacity="0.2" /><path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v102.75l-26.07-26.06a16 16 0 0 0-22.63 0l-20 20l-44-44a16 16 0 0 0-22.62 0L40 149.37V56ZM40 172l52-52l80 80H40Zm176 28h-21.37l-36-36l20-20L216 181.38zm-72-100a12 12 0 1 1 12 12a12 12 0 0 1-12-12" /></g></svg>
                    <div class="flex flex-col justify-start">
                      <div class="w-full text-lg font-semibold">사업자회원</div>
                      <div class="w-full text-sm opacity-60">(용달사업자&헬퍼사업자)</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => handleButtonClick('일반')}>일반회원</button><br />
      <button onClick={() => handleButtonClick('사업자')}>사업자 회원</button><br />








      {status === '일반' &&
        <form onSubmit={handleSignup}>
          id(이메일 주소) <input type="email" ref={refEmail} /><br />
          비밀번호 <input type="password" ref={refPassword} /><br />
          이름 <input type="text" ref={refUsername} /><br />
          핸드폰 번호 <input type="number" ref={refPhone} /><br />
          {error && <p>{error}</p>}
          <button type="submit">회원가입</button>
        </form>
      }
      {status === '사업자' &&
        <form onSubmit={handleSignup}>
          id(이메일 주소) <input type="email" ref={refEmail} /><br />
          비밀번호 <input type="password" ref={refPassword} /><br />
          이름 <input type="text" ref={refUsername} /><br />
          핸드폰 번호 <input type="number" ref={refPhone} /><br />
          <p>사업 업종을 선택해주세요</p>
          용달사업자 <input type="radio" name="type" value="1" onChange={() => handleBusinessType('용달')} />&nbsp;&nbsp;&nbsp;
          헬퍼사업자 <input type="radio" name="type" value="2" onChange={() => handleBusinessType('헬퍼')} /><br />
          사업장명 <input type="text" ref={company_name} /><br />
          대표번호(선택) <input type="number" ref={company_phone} /><br />
          대표자명 <input type="text" ref={ceo_name} /><br />
          사업장 주소 <input type="text" ref={address} /><br />
          사업자 번호 <input type="number" ref={business_number} /><br />
          사업자등록증 <input type="number" ref={business_certificate} /><br />
          유선 연락처(선택) <input type="number" ref={call_number} /><br />
          {error && <p>{error}</p>}
          <button type="submit">회원가입</button>
        </form>
      }
    </div>
  );
};