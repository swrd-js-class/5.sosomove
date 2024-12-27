import React, { useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

//로그인
export default () => {

  const navigate = useNavigate();
  useTracker(() => Meteor.user());
  const refEmail = useRef(null);
  const refPassword = useRef(null);
  //로그인 버튼
  const handleLogin = () => {
    const email = refEmail.current.value;
    const password = refPassword.current.value;
    console.log(email, password);
    Meteor.loginWithPassword({ username: email }, password, (err) => {
      if (err) {
        alert('로그인 실패: ' + err.message);
      } else {
        alert('로그인 되었습니다');
      }
      // 로그인 후
      const user = Meteor.user();
      if (user.profile.type === '관리자') {
        navigate('/admin/adminbcheck');
      } else if (user.profile.type === '일반') {
        navigate('/mypage/checkrequest');
      } else if (user.profile.type === '용달' || '헬퍼') {
        if (user.profile.company.confirm === false) {
          alert('가입승인 중입니다')
          navigate('/');
        } else {
          navigate('/business/allrequest');
        }
      }
    });
  };
  //로그아웃 버튼
  const handleLogout = () => {
    Meteor.logout(() => {
      alert('로그아웃 되었습니다');
      navigate('/');
    });
  };
  //회원가입 버튼
  const handleClick = () => {
    navigate('/signup');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-400'>
      <div className="flex flex-col justify-center items-center bg-white rounded-lg">
        <div className="p-10 border-[1px] border-slate-200 rounded-md flex flex-col items-center space-y-3 flex-grow">
          <div className="py-2">
            <p className="text-[32px] font-bold text-zinc-1000 dark:text-black">Login</p>
          </div>
          <input className="p-3 border-[1px] border-slate-500 w-80 rounded-md" ref={refEmail} type="email" placeholder="이메일을 입력해주세요" />
          <div className="flex flex-col space-y-1 pb-5">
            <input className="p-3 border-[1px] border-slate-500 w-80 rounded-md" ref={refPassword} type="password" placeholder="비밀번호를 입력해주세요" />
          </div>
          <div className="flex flex-col space-y-5 w-full">
            {Meteor.user() ? (
              <button className="w-full bg-[#0070ba] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#003087]" onClick={handleLogout}>로그아웃</button>
            ) : (
              <button className="w-full bg-[#0070ba] rounded-3xl p-3 text-white font-bold transition duration-200 hover:bg-[#003087]" onClick={handleLogin}>로그인</button>
            )}
            <div className="flex items-center justify-center border-t-[1px] border-t-slate-300 w-full relative"></div>
            <button className="w-full border-blue-900 hover:border-[#003087] hover:border-[2px] border-[1px] rounded-3xl p-3 text-[#0070ba] font-bold transition duration-200" onClick={handleClick}>회원가입</button>
          </div>
        </div>
      </div>
    </div>
  );
};