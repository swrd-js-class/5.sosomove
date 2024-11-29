//견적서확인 페이지
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link } from 'react-router-dom';
import "/lib/utils.js";

export default () => {

  let i = 1;
  const userId = Meteor.userId();

  //request테이블에서 견적서내용 리스트 뽑기
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    Meteor.call('requestListCall', { param: userId }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setRequestList(result);
    });
  }, []);


  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">내 견적 요청서</h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link to={'/mypage/newRequest'} >
              <button
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                새 견적 요청
              </button>
            </Link>
          </div>
        </div>
        <div>
          {/* <h2>내 견적요청서</h2> */}
          <div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            No.
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            작성일
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            신청자
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            이삿날
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            출발지
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            도착지
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">View</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {requestList.map((request) => (
                          <tr key={request._id} >
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{i++}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.createdAt.toStringYMD()}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.user_name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.move_date.toStringYMD()}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.start_address}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.arrive_address}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link to={`/mypage/requestdetail/${request._id}`}
                                className="text-indigo-600 hover:text-indigo-900">
                                상세보기
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div>
    </>
  );
};