import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Meteor } from 'meteor/meteor';

//관리자 정보수정
export default () => {

  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const user = Meteor.user();
    if (user) {
      setName(user.profile.name);
      setPhone(user.profile.phone);
    }
  }, []);

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

  return (

    <div>
      <div class="flex bg-gray-100">
        <form onSubmit={handleSubmit}>
          <div class="bg-white bg-clip-border py-6 px-10 max-w-lg shadow-md border">
            <h1 class="text-center text-lg font-bold text-gray-500">내 정보 수정</h1>
            <div class="space-y-4 mt-6">
              <div class="w-full">
                <h2>비밀번호 재설정</h2>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
              <div class="w-full">
                <h2>이름</h2>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
              <div class="w-full">
                <h2>핸드폰 번호</h2>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
            </div>
            <button type="submit" class="w-full mt-5 bg-indigo-600 text-white py-2 rounded-md font-semibold tracking-tight">수정</button>
          </div>
        </form>
      </div>
    </div>
  );
};