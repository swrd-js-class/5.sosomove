import React, { useState } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import { Link } from "react-router-dom";
import { Files } from "/imports/api/Files.js";



export default () => {

  //페이징처리+'승인신청 중'인 사업자 리스트
  const PageSize = 5;  //한 페이지당 갯수 조정
  const [currentPage, setCurrentPage] = useState(1);

  const UsersAll = useTracker(() => {
    const skip = (currentPage - 1) * PageSize;
    const limit = PageSize;
    Meteor.subscribe('users_paged', skip, limit);
    return Meteor.users.find(
      {
        "profile.type": { $in: ["헬퍼", "용달"] },
        "profile.company.confirm": false
      },
      { sort: { createdAt: -1 }, skip, limit }).fetch();
  }, [currentPage]);
  const totalCount = Meteor.users.find({ "profile.type": { $in: ["헬퍼", "용달"] }, "profile.company.confirm": false }).count();
  const totalPages = Math.ceil(totalCount / PageSize);


  //승인버튼 눌러서 가입 승인
  const SignupConfirm = (_id) => {
    Meteor.call('users.update', _id, true, (error, result) => {
      if (error) {
        console.error('Error:', error);
        alert('업데이트 실패');
      } else {
        alert('가입이 승인되었습니다.');
      }
    });
    UsersAll();
  };

  // 각 유저에 해당하는 파일을 가져오기
  const files = useTracker(() => {
    Meteor.subscribe('files');
    return UsersAll.reduce((acc, user) => {
      const userFiles = Files.find({ userId: user._id }).fetch();
      return [...acc, ...userFiles];
    }, []);
  }, [UsersAll]);
  console.log(files);



  return (

    // 사이드바
    <div class="flex">
      <div class="relative flex flex-col bg-clip-border bg-white text-gray-700 h-[calc(100vh-4rem)] w-full max-w-[20rem] p-4  border">
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
                <Link to="/adminbcheck" >사업자회원 승인여부 체크</Link>
              </div>
            </li>
            <li>
              <div role="button" tabindex="0" class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                <div class="grid place-items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <Link to="/adminblist" >사업자회원 목록</Link>
              </div>
            </li>
            <li>
              <div role="button" tabindex="0" class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                <div class="grid place-items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <Link to="/adminedit" >내 정보 수정</Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <h1>사업자회원 승인여부 체크 목록</h1>
        <div className="max-w-full mx-auto">
          <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <table class="w-full text-left table-auto min-w-max">
              <thead>
                <tr>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      사업자종류
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      사업자명
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      사업자등록번호
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      사업자등록증
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      승인여부
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {UsersAll.map((user) => {
                  const userFiles = files.filter(file => file.userId === user._id);
                  return (
                    <tr key={user._id} class="hover:bg-slate-50 border-b border-slate-200">
                      <td class="p-4 py-5">
                        <p class="block font-semibold text-sm text-slate-800">{user.profile.type}</p>
                      </td>
                      <td class="p-4 py-5">
                        <p class="text-sm text-slate-500">{user.username}</p>
                      </td>
                      <td class="p-4 py-5">
                        <p class="text-sm text-slate-500">{user.profile.company.business_number}</p>
                      </td>

                      {/* 사업자등록증 파일 보이게 */}
                      <td class="p-4 py-5">
                        {userFiles.map((file) => {
                          return (
                            <div key={file._id}>
                              {file.name}/
                              <button className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-200"
                                onClick={() => {
                                  Meteor.call('getFileLink', file._id, (err, link) => {
                                    if (err) {
                                      alert('파일 링크를 가져오는 데 실패했습니다: ' + err.message);
                                    } else {
                                      window.open(link, '_blank');
                                    }
                                  });
                                }}
                              >
                                파일확인
                              </button>
                            </div>
                          );
                        })}
                      </td>

                      <td class="p-4 py-5">
                        <button onClick={() => SignupConfirm(user._id)} class="middle none center rounded-lg bg-pink-500 py-1 px-3 font-sans text-xs font-bold uppercase text-white transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          data-ripple-light="true">승인</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 페이징처리 */}
            <div class="flex justify-between items-center px-4 py-3">
              <div class="flex space-x-1">
                <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  이전
                </button>
                <div class="text-sm text-slate-500">
                  {` page ${currentPage} of ${totalPages} `}
                </div>
                <button class="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  다음
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};