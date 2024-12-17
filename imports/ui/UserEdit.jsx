import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//일반회원 정보수정
export default () => {

  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = Meteor.user();
    if (user) {
      setName(user.profile.name);
      setPhone(user.profile.phone);
    }
  }, []);

  //회원정보 수정 버튼
  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.call("useredit", { name, phone }, (err) => {
      if (err) {
        alert('Error: ' + err.message);
      } else {
        alert("회원정보가 수정되었습니다")
      }
    });
    if (password) {
      Meteor.call("userchangepw", password, (err) => {
        if (err) {
          alert('Error: ' + err.message);
        } else {
          alert("비밀번호가 변경되었습니다")
        }
      });
    }
  };

  //회원탈퇴 버튼
  const deleteAccount = () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      Meteor.call('users.removeAccount', (error, result) => {
        if (error) {
          alert('탈퇴 실패: ' + error.message);
        } else {
          alert('탈퇴 성공');
          Meteor.logout(() => {
            navigate('/');
          });
        }
      });
    }
  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white py-6 px-10 shadow-lg rounded-lg">
        <h1 className="text-center text-lg font-bold text-gray-700 mb-6">내 정보 관리</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="w-full">
              <h2 className="text-sm font-medium text-gray-600 mb-1">비밀번호 재설정</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <h2 className="text-sm font-medium text-gray-600 mb-1">이름</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <h2 className="text-sm font-medium text-gray-600 mb-1">핸드폰 번호</h2>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-5 bg-indigo-500 text-white py-2 rounded-lg font-semibold tracking-tight hover:bg-indigo-600 transition"
          >
            수정
          </button>
        </form>
        <button
          onClick={deleteAccount}
          className="w-full mt-5 bg-red-500 text-white py-2 rounded-lg font-semibold tracking-tight hover:bg-red-600 transition"
        >
          탈퇴
        </button>
      </div>
    </div>
  );
}  