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

    const allRequests = CollectionRequest.find({ _id: { $nin: submitRequestIds }}).fetch();

    return { 
      user,
      businessType, 
      requests : allRequests,
    };
  }, []);

  const subAreas = area.find((area) => area.name === selectedArea)?.subArea || [];

  const filteredRequests = requests.filter((request) => {
    if (!selectedArea && !selectedSubArea) return true;
    const startInArea = request.start_address.includes(selectedArea) && request.start_address.includes(selectedSubArea);
    const arriveInArea = request.arrive_address.includes(selectedArea) && request.arrive_address.includes(selectedSubArea);
    return startInArea || arriveInArea;
  });

  if (businessType === "일반" || businessType === "관리자") {
    return <p>해당 페이지에 접근할 수 없습니다.</p>;
  }

  return (
    <>
      <div>
        <BusinessMypageNavbar />
      </div>

      <div className="max-w-full mx-auto">
      <h1>{user.profile.name}님 환영합니다!</h1>
        <h2>{businessType} 요청서 목록</h2>

        {/* 지역 선택 필터 */}
        <div className="mt-5">
          <select value={selectedArea} onChange={(e) => {
            setSelectedArea(e.target.value);
            setSelectedSubArea("");
          }} className="text-center border-2 py-2 px-2 mx-1 rounded-md text-black">
            <option value="">지역 선택</option>
            {area.map((area) => (
              <option key={area.name} value={area.name}>
                {area.name}
              </option>
            ))}
          </select>

            <select value={selectedSubArea} onChange={(e) => setSelectedSubArea(e.target.value)} className="text-center border-2 py-2 px-2 mx-1 rounded-md text-black">
              <option value="">시/군/구 선택</option>
              {subAreas.map((subArea) => (
                <option key={subArea} value={subArea}>
                  {subArea}
                </option>
              ))}
            </select>
        </div>

        {filteredRequests.length > 0 ? (
          <ul>
            {filteredRequests.map((request) => (
              request.reqCar.car_confirm_id === null && request.reqHelper.hel_confirm_id === null? (
              <li key={request._id}>
                <p>{request.user_name}님의 이사 견적 요청</p>
                <p>이사 날짜: {new Date(request.move_date).toLocaleDateString()}</p>
                <p>출발지: {request.start_address}</p>
                <p>도착지: {request.arrive_address}</p>
                <p>현재 집 평수: {request.house_size}평</p>
                {businessType === '용달' && (
                  <p>인부 추가: {request.addworker ? '1명 추가' : '없음'}</p>
                )}
                {businessType === '헬퍼' && request && (
                  <>
                    <p>요청 시간대: {request.reqHelper.request_time_area}</p>
                    <p>요청 사항: {request.reqHelper.h_type}</p>
                  </>
                )}
                <Link to={`/request-details/${request._id}`}>상세 보기</Link>
              </li>
              ) : null
            ))}
          </ul>
        ) : (
          <p>현재 요청서가 없습니다.</p>
        )}
        <Link to="businessNavbar" className="mt-10 inline-block">뒤로 가기</Link>
      </div>
    </>
  );
};