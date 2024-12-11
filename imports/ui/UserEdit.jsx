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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="mt-6 text-base font-semibold text-gray-900">내 정보 관리</h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="w-full">
                  <h2 className="text-sm font-medium text-gray-500">비밀번호 재설정</h2>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="mt-1 block w-80 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
                <div className="w-full">
                  <h2 className="text-sm font-medium text-gray-500">이름</h2>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="mt-1 block w-80 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
                <div className="w-full">
                  <h2 className="text-sm font-medium text-gray-500">핸드폰 번호</h2>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="mt-1 block w-80 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-5">
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  수정
                </button>
                <button 
                  onClick={deleteAccount} 
                  className="bg-red-600 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  탈퇴
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};