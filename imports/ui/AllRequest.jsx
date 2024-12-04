import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { CollectionRequest, CollectionEstimate } from '/imports/api/collections';
import { Link } from 'react-router-dom';
import { area } from "./BusinessArea.jsx"
import BusinessMypageNavbar from "./BusinessMypageNavbar.jsx";


export default () => {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");


  const { user, businessType, requests } = useTracker(() => {
    // 구독
    Meteor.subscribe('Users');
    Meteor.subscribe('CollectionRequest');
    Meteor.subscribe('CollectionEstimate');

    const user = Meteor.user();
    const businessType = user.profile.type || null;
    const businessId = user._id;

    const submitRequestIds = CollectionEstimate.find({ business_id: businessId }).map(estimate => estimate.request_id);

    const allRequests = CollectionRequest.find({ _id: { $nin: submitRequestIds } }).fetch();

    return {
      user,
      businessType,
      requests: allRequests,
    };
  }, []);

  const subAreas = area.find((area) => area.name === selectedArea)?.subArea || [];

  const filteredRequests = requests.filter((request) => {
    if (!selectedArea && !selectedSubArea) return true;
    const startInArea = request.start_address.includes(selectedArea) && request.start_address.includes(selectedSubArea);
    const arriveInArea = request.arrive_address.includes(selectedArea) && request.arrive_address.includes(selectedSubArea);
    return startInArea || arriveInArea;
  }).filter((request) => {
    if (businessType === "헬퍼") {
      return request.reqHelper.request_time_area !== "" || request.reqHelper.h_type === true;
    }
    return true;
  })
  .sort((a, b) => new Date(a.move_date) - new Date(b.move_date));

  return (
<div className="px-4 sm:px-6 lg:px-8">
  <div className="sm:flex sm:items-center">
    <div className="sm:flex-auto">
      <h1 className="mt-6 text-base font-semibold text-gray-900">{businessType} 요청서 목록</h1>
      <p className="mt-2 text-sm text-gray-700">{user.profile.name}님 환영합니다!</p>
    </div>
    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <div className="mt-5">
        <select
          value={selectedArea}
          onChange={(e) => {
            setSelectedArea(e.target.value);
            setSelectedSubArea("");
          }}
          className="text-center border-2 py-2 px-2 mx-1 rounded-md text-black"
        >
          <option value="">지역 선택</option>
          {area.map((area) => (
            <option key={area.name} value={area.name}>
              {area.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubArea}
          onChange={(e) => setSelectedSubArea(e.target.value)}
          className="text-center border-2 py-2 px-2 mx-1 rounded-md text-black"
        >
          <option value="">시/군/구 선택</option>
          {subAreas.map((subArea) => (
            <option key={subArea} value={subArea}>
              {subArea}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
  <div className="mt-8 flow-root">
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col"
                   className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 aline-middle"
                >
                  요청자 이름
                </th>
                <th scope="col"
                   className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 aline-middle"
                >
                  이사 날짜
                </th>
                <th scope="col"
                   className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 aline-middle"
                >
                  출발지
                </th>
                <th scope="col"
                   className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 aline-middle"
                >
                  도착지
                </th>
                <th scope="col"
                   className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 aline-middle"
                >
                  현재 집 평수
                </th>
                {businessType === "용달" && (
                  <th scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 aline-middle"
                  >
                    인부 추가
                  </th>
                )}
                {businessType === "헬퍼" && (
                  <th scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-50 aline-middle"
                  >
                    요청 시간대 / 요청 사항
                  </th>
                )}
                <th scope="col"
                   className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 aline-middle"
                >
                  <span className="sr-only">상세 보기</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                      {request.user_name}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                      {new Date(request.move_date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                      {request.start_address}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                      {request.arrive_address}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                      {request.house_size}평
                    </td>
                    {businessType === "용달" && (
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                        {request.addworker ? "1명 추가" : "없음"}
                      </td>
                    )}
                    {businessType === "헬퍼" && (
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-50">
                        {request.reqHelper.request_time_area} /{" "}
                        {request.reqHelper.h_type}
                      </td>
                    )}
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to={`/business/request-details/${request._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        상세 보기
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="100%"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    요청서가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
