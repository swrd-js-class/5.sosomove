import React, { useState, useEffect } from "react";

//전체회원 목록
export default () => {

  //모든회원 리스트
  const PageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedusers, setSearchedUsers] = useState([]);

  useEffect(() => {
    Meteor.call('users.list', (err, res) => {
      if (err) {
        console.error(err);
      } else {
        setSearchedUsers(res);
      }
    });
  }, []);

  //회원검색 버튼
  const searchUsers = () => {
    Meteor.call('users.search', searchQuery, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        setSearchedUsers(res);
        setCurrentPage(1);
      }
    });
  };

  // 검색된 사용자 리스트에서 페이징 적용
  const paginatedUsers = searchedusers.slice((currentPage - 1) * PageSize, currentPage * PageSize);
  const totalPages = Math.ceil(searchedusers.length / PageSize);

  const userdelete = (userId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      Meteor.call('userdelete', userId, (error, result) => {
        if (error) {
          alert('회원삭제 실패: ' + error.message);
        } else {
          alert('회원이 삭제되었습니다');
        }
      });
    }
  }


  return (

    <div>
      <h1>회원 조회</h1>
      <div className="gap-x-2 pb-5 flex items-center">
        <input type="text" placeholder="회원이름 또는 사업장명" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-md bg-white text-sm text-black outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 mr-3" />
        <button onClick={searchUsers} className="flex-none rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">검색</button>
      </div>
      {paginatedUsers.length > 0 ? (
        <div className="max-w-full mx-auto">
          <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <table class="w-full text-left table-auto min-w-max">
              <thead>
                <tr>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      아이디
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      회원유형
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      회원이름
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      전화번호
                    </p>
                  </th>
                  <th class="p-4 border-b border-slate-200 bg-slate-50">
                    <p class="text-sm font-normal leading-none text-slate-500">
                      비고
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} class="hover:bg-slate-50 border-b border-slate-200">
                    <td class="p-4 py-5">
                      <p class="block font-semibold text-sm text-slate-800">{user.username}</p>
                    </td>
                    <td class="p-4 py-5">
                      <p class="text-sm text-slate-500">{user.profile.type}</p>
                    </td>
                    <td class="p-4 py-5">
                      <p class="text-sm text-slate-500">{user.profile.name}</p>
                    </td>
                    <td class="p-4 py-5">
                      <p class="text-sm text-slate-500">{user.profile.phone}</p>
                    </td>
                    <td class="p-4 py-5">
                      <button onClick={() => userdelete(user._id)} class="middle none center rounded-lg bg-red-500 py-1 px-3 font-sans text-xs font-bold uppercase text-white transition-all" data-ripple-light="true">삭제</button>
                    </td>
                  </tr>
                ))}
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
      ) : (
        <p>검색 결과 없음</p>
      )}
    </div>
  );
};