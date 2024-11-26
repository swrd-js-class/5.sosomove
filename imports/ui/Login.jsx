import React, { useRef, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

//로그인
export default () => {
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(true);

  useTracker(() => Meteor.user());
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  const handleLogin = () => {
    const email = refEmail.current.value;
    const password = refPassword.current.value;
    console.log(email, password);

    Meteor.loginWithPassword({ username: email }, password, (err) => {
      if (err) {
        console.error('로그인 실패:', err);
        alert('로그인 실패: ' + err.message);
      } else {
        alert('로그인 되었습니다');
      }
      // 로그인 후
      const user = Meteor.user();
      if (user.profile.type === '관리자') {
        navigate('/admin'); //관리자 페이지 이동
      } else if (user.profile.type === '일반') {
        navigate('/checkrequest'); //일반회원 마이페이지로 이동
      } else if (user.profile.type === '용달' || '헬퍼') {
        if (user.profile.company.confirm === false) {
          alert('가입승인 중입니다')
          navigate('/');
        } else {
          navigate('/businessNavbar'); //사업자 마이페이지로 이동
        }
      }
    });
  };
  const handleLogout = () => {
    Meteor.logout(() => {
      alert('로그아웃 되었습니다');
    });
  };
  const handleClick = () => {
    setShowImage(false);
    navigate('/signup');
  };


  return (
    <div>
      {showImage && (
        <div class='flex items-center justify-center min-h-screen from-blue-100 via-blue-300 to-blue-500 bg-gradient-to-br'>
          <div class="flex flex-col justify-center items-center bg-white">
            <div class="p-10 border-[1px] border-slate-200 rounded-md flex flex-col items-center space-y-3 flex-grow">
              <div class="py-8">
                <p class="text-[32px] font-bold text-zinc-950 dark:text-white">Login</p>
              </div>
              <input class="p-3 border-[1px] border-slate-500 rounded-sm w-80" ref={refEmail} type="email" placeholder="이메일을 입력해주세요" />
              <div class="flex flex-col space-y-1">
                <input class="p-3 border-[1px] border-slate-500 rounded-sm w-80" ref={refPassword} type="password" placeholder="비밀번호를 입력해주세요" />
                <div class="flex justify-center space-x-8">
                  <p class="font-bold text-[#0070ba]">아이디 찾기</p>
                  <p class="font-bold text-[#0070ba]">비밀번호 찾기</p>
                </div>
              </div>
              <div class="flex flex-col space-y-5 w-full">
                {Meteor.user() ? (
                  <button class="w-full bg-[#0070ba] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#003087]" onClick={handleLogout}>로그아웃</button>
                ) : (
                  <button class="w-full bg-[#0070ba] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#003087]" onClick={handleLogin}>로그인</button>
                )}
                <div class="flex items-center justify-center border-t-[1px] border-t-slate-300 w-full relative"></div>
                <button class="w-full border-blue-900 hover:border-[#003087] hover:border-[2px] border-[1px] rounded-3xl p-3 text-[#0070ba] font-bold transition duration-200" onClick={handleClick}>회원가입</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};