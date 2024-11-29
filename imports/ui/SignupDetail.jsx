import React, { useState, useRef } from "react";
import { Accounts } from 'meteor/accounts-base';
import { useParams } from 'react-router-dom';
import { Files } from "/imports/api/Files.js";
import { useNavigate } from 'react-router-dom';


//회원가입
export default () => {

  const navigate = useNavigate();

  //일반회원과 사업자회원을 param으로 구별
  const { userType } = useParams();

  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refUsername = useRef(null);
  const refPhone = useRef(0);
  const ceo_name = useRef(null);
  const address = useRef(null);
  const business_number = useRef(0);

  //사업자등록증 파일 첨부 위한 코드
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLink, setFileLink] = useState('');
  const handleFileChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      setSelectedFile(file);
    }
  };
  //용달사업자와 헬퍼사업자 구별 
  const [type, setType] = useState('none');
  const [error, setError] = useState('');
  const handleBusinessType = (e) => {
    setType(e);
  };

  //회원가입 버튼
  const handleSignup = (event) => {
    event.preventDefault();
    const email = refEmail.current.value;
    const password = refPassword.current.value;
    const name = refUsername.current.value;
    const phone = refPhone.current.value;

    // 사업자회원만 company에 추가 정보
    let company = null;
    if (userType === '사업자') {
      company = {
        ceo_name: ceo_name.current ? ceo_name.current.value : '',
        address: address.current ? address.current.value : '',
        business_number: business_number.current ? business_number.current.value : null,
        confirm: false,
      };
    }

    //사업자등록증 DB 저장
    function upload() {
      if (!selectedFile) {
        alert("No file selected for upload.");
        return;
      }
      const upload = Files.insert(
        {
          file: selectedFile,
          chunkSize: "dynamic",
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
              setFileLink(link);
            }
          });
        }
      });
      upload.start();
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
        if (userType === '사업자') {
          upload();
        } else {
        }
        alert('회원가입 되었습니다!');
        navigate('/');
      }
    }
    );
  };

  return (
    <div class='flex items-center justify-center min-h-screen from-sky-100 via-sky-300 to-sky-500 bg-gradient-to-br'>
      {userType === '일반' &&
        <div class="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-sm lg:mt-0 lg:w-5/12">
          <form onSubmit={handleSignup} >
            <div class="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p class="w-full text-4xl font-medium text-center leading-snug font-sans">일반회원</p>
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
              <p class="w-full text-4xl font-medium text-center leading-snug font-sans">사업자회원</p>
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
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업장명</p>
                  <input type="text" ref={refUsername} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">대표번호</p>
                  <input type="number" ref={refPhone} className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md"/>
                </div>
                {/* /////여기서부터 사업자 추가 입력////// */}
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
                {/* 사업자등록증 파일 첨부 */}
                <div class="relative">
                  <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">사업자등록증</p>
                  <input type="file" onChange={handleFileChange} className="border placeholder-gray-400 focus:outline-none
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
  );
};