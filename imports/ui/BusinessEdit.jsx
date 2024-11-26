import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Meteor } from 'meteor/meteor';


//사업자 정보수정
export default () => {

  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ceo_name, setCeoName] = useState('');
  const [address, setAddress] = useState('');


  useEffect(() => {
    const user = Meteor.user();
    if (user) {
      setName(user.profile.name);
      setPhone(user.profile.phone);
      setCeoName(user.profile.company.ceo_name);
      setAddress(user.profile.company.address);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.call("businessedit", { name, phone, ceo_name, address }, (err) => {
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

    // 사이드바
    <div class="flex h-screen bg-rose-50">
      <div class="relative flex flex-col bg-clip-border bg-white text-gray-700 h-full w-full max-w-[20rem] p-4 border">
        <div class="mb-2 p-4">
          <h5 class="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">관리자페이지</h5>
        </div>
        <nav class="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
          <ul>
            <li>
              <div role="button" tabindex="0" class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                <div class="grid place-items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <Link to="/" >...</Link>
              </div>
            </li>
            <li>
              <div role="button" tabindex="0" class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                <div class="grid place-items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <Link to="/" >...</Link>
              </div>
            </li>
            <li>
              <div role="button" tabindex="0" class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                <div class="grid place-items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <Link to="/businessedit" >내 정보 수정</Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* 수정할 내용 */}
      <form onSubmit={handleSubmit}>
        <div class="flex h-screen bg-gray-100">
          <div class="bg-white bg-clip-border py-6 px-10 max-w-lg shadow-md border">
            <h1 class="text-center text-lg font-bold text-gray-500">내 정보 수정</h1>

            <div class="space-y-4 mt-6">
              <div class="w-full">
                <h2>비밀번호 재설정</h2>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
              <div class="w-full">
                <h2>사업장명</h2>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
              <div class="w-full">
                <h2>대표번호</h2>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
              <div class="w-full">
                <h2>대표자명</h2>
                <input type="text" value={ceo_name} onChange={(e) => setCeoName(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
              <div class="w-full">
                <h2>사업장 주소</h2>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} class="px-4 py-2 bg-gray-50" />
              </div>
            </div>



            <button type="submit" class="w-full mt-5 bg-indigo-600 text-white py-2 rounded-md font-semibold tracking-tight">수정</button>
          </div>
        </div>
      </form>

    </div>
  );
};