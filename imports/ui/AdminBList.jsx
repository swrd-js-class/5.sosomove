import React, { useState } from "react";
import { useTracker } from 'meteor/react-meteor-data';

//사업자회원 목록
export default () => {

  //모든 사업자 리스트
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

    <div className="mt-6 ml-6 mr-6">
      <h1>사업자회원 목록</h1>
      <div className="mt-4 max-w-full mx-auto">
        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    사업자유형
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    사업장명
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    대표번호
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    대표자명
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    사업자등록번호
                  </p>
                </th>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    승인여부
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {UsersList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 py-5 text-gray-500">
                    결과가 없습니다.
                  </td>
                </tr>
              ) : (
                UsersList.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 border-b border-slate-200">
                    <td className="p-4 py-5">
                      <p className="block font-semibold text-sm text-slate-800">{user.profile.type}</p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-slate-500">{user.profile.name}</p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-slate-500">{user.profile.phone}</p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-slate-500">{user.profile.company.ceo_name}</p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-slate-500">{user.profile.company.business_number}</p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-red-500 font-bold">{user.profile.company.confirm === false ? '가입신청 중' : '승인됨'}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이징처리 */}
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex space-x-1">
              <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                이전
              </button>
              <div className="text-sm text-slate-500">
                {` page ${currentPage} of ${totalPages} `}
              </div>
              <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                다음
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
};