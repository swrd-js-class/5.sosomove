import React, { useState } from "react";
import { useTracker } from 'meteor/react-meteor-data';

//사업자회원 목록
export default () => {

  //페이징처리+모든 사업자 리스트
  const PageSize = 5;  //한 페이지당 갯수
  const [currentPage, setCurrentPage] = useState(1);

  const UsersList = useTracker(() => {
    const skip = (currentPage - 1) * PageSize;
    const limit = PageSize;
    Meteor.subscribe('users', skip, limit);
    return Meteor.users.find(
      {
        "profile.type": { $in: ["헬퍼", "용달"] },
      },
      { sort: { createdAt: -1 }, skip, limit }).fetch();
  }, [currentPage]);

  const totalCount = Meteor.users.find({ "profile.type": { $in: ["헬퍼", "용달"] } }).count();
  const totalPages = Math.ceil(totalCount / PageSize);


  return (

    <div>
      <h1>사업자회원 목록</h1>
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
                    사업장명
                  </p>
                </th>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    대표자명
                  </p>
                </th>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    사업자등록번호
                  </p>
                </th>
                <th class="p-4 border-b border-slate-200 bg-slate-50">
                  <p class="text-sm font-normal leading-none text-slate-500">
                    대표번호
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
              {UsersList.map((user) => (
                <tr key={user._id} class="hover:bg-slate-50 border-b border-slate-200">
                  <td class="p-4 py-5">
                    <p class="block font-semibold text-sm text-slate-800">{user.profile.type}</p>
                  </td>
                  <td class="p-4 py-5">
                    <p class="text-sm text-slate-500">{user.profile.name}</p>
                  </td>
                  <td class="p-4 py-5">
                    <p class="text-sm text-slate-500">{user.profile.company.ceo_name}</p>
                  </td>
                  <td class="p-4 py-5">
                    <p class="text-sm text-slate-500">{user.profile.company.business_number}</p>
                  </td>
                  <td class="p-4 py-5">
                    <p class="text-sm text-slate-500">{user.profile.phone}</p>
                  </td>
                  <td class="p-4 py-5">
                    <p class="text-sm text-slate-500">{user.profile.company.confirm === false ? '가입신청 중' : '승인됨'}</p>
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
    </div>

  );
};