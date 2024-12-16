import React, { useState, useRef } from "react";
import { Accounts } from 'meteor/accounts-base';
import { useParams } from 'react-router-dom';
import { Files } from "/imports/api/Files.js";
import { useNavigate } from 'react-router-dom';


//회원가입
export default () => {
  const navigate = useNavigate();

  //일반&사업자 param으로 구별
  const { userType } = useParams();

  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refUsername = useRef(null);
  const refPhone = useRef(0);
  const refCeo_name = useRef(null);
  const refAddress = useRef(null);
  const refBusiness_number = useRef(0);

  //용달&헬퍼 구별 
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const handleBusinessType = (e) => {
    setType(e);
  };

  //사업자등록증 파일
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLink, setFileLink] = useState('');


  //사업자등록증 파일 선택
  const handleFileChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      setSelectedFile(file);
    }
  };

  //회원가입 버튼
  const handleSignup = (event) => {
    event.preventDefault();
    const email = refEmail.current.value;
    const password = refPassword.current.value;
    const name = refUsername.current.value;
    const phone = refPhone.current.value;
    let ceo_name = '';
    let address = '';
    let business_number = '';

    //사업자회원만 company에 추가 정보
    let company = null;
    if (userType === '사업자') {
      ceo_name = refCeo_name.current.value;
      address = refAddress.current.value;
      business_number = refBusiness_number.current.value;
      company = {
        ceo_name,
        address,
        business_number,
        confirm: false,
      };
    }
    //필수입력 강제
    if (userType === '일반') {
      if (!email || !password || !name || !phone) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
    }
    if (userType === '사업자') {
      if (!email || !password || !name || !phone || !ceo_name || !address || !business_number) {
        alert('모든 항목을 입력해주세요.');
        return;
      }
      if (!type) {
        alert('사업자 유형을 선택해주세요');
        return;
      }
      if (!selectedFile) {
        alert("사업자등록증을 첨부해주세요");
        return;
      }
    }
    //회원정보 DB 저장
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
        setError(err.reason);
      } else {
        setError('');
        //회원가입이 성공적으로 완료된 후, 사업자라면 파일 업로드
        if (userType === '사업자') {
          const userId = Meteor.userId();
          uploadFile(userId);
        } else {
          alert('회원가입 완료되었습니다!');
          Meteor.logout(() => { });
          navigate('/login');
        }
      }
    }
    );
  };

  //파일 업로드 함수
  function uploadFile(userId) {
    if (!selectedFile) {
      alert("No file selected for upload.");
      return;
    }
    const upload = Files.insert(
      {
        file: selectedFile,
        chunkSize: "dynamic",
        meta: { userId: userId }
      },
      false
    );
    upload.on("start", function () {
      console.log("Upload started...");
    });
    upload.on("end", function (error, fileObj) {
      if (error) {
        alert(`업로드 중 에러: ${error}`);
      } else {
        alert(`파일 "${fileObj.name}" 업로드 완료`);
        Meteor.call('getFileLink', fileObj._id, (err, link) => {
          if (err) {
            alert('파일 링크를 가져오는 데 실패했습니다: ' + err.message);
          } else {
            setFileLink(link); // 파일 링크 업데이트
            alert('회원가입 및 파일 업로드가 완료되었습니다!');
            Meteor.logout(() => { });
            navigate('/login');
          }
        });
      }
    });
    upload.start();
  }

  return (
    <div class='flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-400'>
      {userType === '일반' &&
        <div class="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-sm lg:mt-0 lg:w-5/12">
          <form onSubmit={handleSignup} >
            <div class="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white rounded-xl relative z-10 border ">
              <p class="w-full text-[32px] font-medium text-center leading-snug font-sans">일반회원</p>
              <div class="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-5">
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">ID(이메일 주소)</p>
                  <input type="email" ref={refEmail} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">비밀번호</p>
                  <input type="password" ref={refPassword} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">이름</p>
                  <input type="text" ref={refUsername} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">핸드폰번호</p>
                  <input type="number" ref={refPhone} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <button type="submit" className="w-full inline-block pt-3 pr-3 pb-3 pl-3 text-xl font-medium text-center text-white bg-[#0070ba]
                  rounded-lg transition duration-200 ">회원가입</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      }
      {userType === '사업자' &&
        <div class="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-sm lg:mt-20 lg:mb-20 lg:w-5/12">
          <form onSubmit={handleSignup} >
            <div class="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white rounded-xl relative z-10 border">
              <p class="w-full text-[32px] font-medium text-center leading-snug font-sans">사업자회원</p>
              <div class="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-5">
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">ID(이메일 주소)</p>
                  <input type="email" ref={refEmail} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                  absolute">비밀번호</p>
                  <input type="password" ref={refPassword} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업장명</p>
                  <input type="text" ref={refUsername} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">대표번호</p>
                  <input type="number" ref={refPhone} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업 업종을 선택해주세요</p>
                  <div className="border placeholder-gray-400 focus:outline-none
                      focus:border-black w-full pt-4 pr-3 pb-4 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                      border-gray-300 rounded-md ">
                    <div className="flex justify-between items-center">
                      <label>
                        <input type="radio" name="type" value="용달" onChange={() => handleBusinessType('용달')} className="mr-2" />용달사업자
                      </label>
                      <label>
                        <input type="radio" name="type" value="헬퍼" onChange={() => handleBusinessType('헬퍼')} className="mr-2" />헬퍼사업자
                      </label>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">대표자명</p>
                  <input type="text" ref={refCeo_name} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업장 주소</p>
                  <input type="text" ref={refAddress} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업자 번호</p>
                  <input type="number" ref={refBusiness_number} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-3 pr-3 pb-3 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                {/* 사업자등록증 */}
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업자등록증</p>
                  <input type="file" onChange={handleFileChange} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-3 pb-4 pl-3 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <button type="submit" className="w-full inline-block pt-3 pr-3 pb-3 pl-3 text-xl font-medium text-center text-white bg-[#0070ba]
                  rounded-lg transition duration-200 ">회원가입</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      }
    </div>
  );
};