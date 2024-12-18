import React, { useState } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import { Files } from "/imports/api/Files.js";

//사업자회원 승인여부 체크
export default () => {

  //승인신청 중 사업자 리스트
  const PageSize = 5;  //한 페이지당 갯수 조정
  const [currentPage, setCurrentPage] = useState(1);
  const UsersAll = useTracker(() => {
    const skip = (currentPage - 1) * PageSize;
    const limit = PageSize;
    Meteor.subscribe('users', skip, limit);
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
    Meteor.call('users.update', _id, (error, result) => {
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

    <div className="mt-6 ml-6 mr-6">
      <h1>사업자회원 승인여부 체크 목록</h1>
      <div className="mt-4 max-w-full mx-auto">
        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-200 bg-slate-50">
                  <p className="text-sm font-normal leading-none text-slate-500">
                    사업자종류
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
                    사업자등록증
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
              {UsersAll.map((user) => {
                const userFiles = files.filter(file => file.userId === user._id);
                return (
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
                    {/* 사업자등록증 파일 보이게 */}
                    <td className="p-4 py-5">
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
                    <td className="p-4 py-5">
                      <button onClick={() => SignupConfirm(user._id)} className="middle none center rounded-lg bg-pink-500 py-1 px-3 text-xs font-bold uppercase text-white transition-all" data-ripple-light="true">
                        승인
                      </button>
                    </td>
                  </tr>
                );
              })}
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