import React, { useState, useRef } from "react";
import { Accounts } from 'meteor/accounts-base';
import { useParams } from 'react-router-dom';

//회원가입
export default () => {

  //일반회원과 사업자회원을 param으로 구별
  const { userType } = useParams();
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

  //용달사업자와 헬퍼사업자 구별 
  const [type, setType] = useState('none');
  const [error, setError] = useState('');

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
    if (userType === 'business') {
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
        type: userType === '일반' ? '일반' : type,
        name: name,
        phone: phone,
        company: userType === '사업자' ? company : null,
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
    <>
      <div class='flex items-center justify-center min-h-screen from-blue-100 via-blue-300 to-blue-500 bg-gradient-to-br'>
        {/* css 적용 */}
        {userType === '일반' &&
          <div class="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-sm lg:mt-0 lg:w-5/12">
            <form onSubmit={handleSignup} >
              <div class="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
                <p class="w-full text-4xl font-medium text-center leading-snug font-serif">일반회원</p>
                <div class="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">ID(이메일 주소)</p>
                    <input type="email" ref={refEmail} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">비밀번호</p>
                    <input type="password" ref={refPassword} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">이름</p>
                    <input type="text" ref={refUsername} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">핸드폰번호</p>
                    <input type="number" ref={refPhone} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <button type="submit" className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500
                  rounded-lg transition duration-200 hover:bg-indigo-600 ease">회원가입</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        }

        {userType === '사업자' &&
          <div class="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-sm lg:mt-0 lg:w-5/12">
            <form onSubmit={handleSignup} >
              <div class="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
                <p class="w-full text-4xl font-medium text-center leading-snug font-serif">사업자</p>
                <div class="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">ID(이메일 주소)</p>
                    <input type="email" ref={refEmail} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">비밀번호</p>
                    <input type="password" ref={refPassword} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">이름</p>
                    <input type="text" ref={refUsername} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">핸드폰번호</p>
                    <input type="number" ref={refPhone} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>

                  {/* /////여기서부터 사업자항목만 입력////// */}
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업 업종을 선택해주세요</p>
                    <div className="border placeholder-gray-400 focus:outline-none
                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                      border-gray-300 rounded-md ">
                      <div className="flex justify-between items-center">
                        <label>
                          <input type="radio" name="type" value="1" onChange={() => handleBusinessType('용달')} className="mr-2" />용달사업자
                        </label>
                        <label>
                          <input type="radio" name="type" value="2" onChange={() => handleBusinessType('헬퍼')} className="mr-2" />헬퍼사업자
                        </label>
                      </div>
                    </div>

                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업장명</p>
                    <input type="text" ref={company_name} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">대표번호(선택)</p>
                    <input type="text" ref={company_phone} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">대표자명</p>
                    <input type="text" ref={ceo_name} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업장 주소</p>
                    <input type="text" ref={address} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업자 번호</p>
                    <input type="number" ref={business_number} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업자등록증</p>
                    <input type="text" ref={business_certificate} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">유선연락처(선택)</p>
                    <input type="text" ref={call_number} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                  </div>
                  <div class="relative">
                    <button type="submit" className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500
                  rounded-lg transition duration-200 hover:bg-indigo-600 ease">회원가입</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        }

      </div>
    </>
  );
};