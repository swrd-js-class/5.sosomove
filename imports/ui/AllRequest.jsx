import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { CollectionRequest, CollectionEstimate } from '/imports/api/collections';
import { Link } from 'react-router-dom';


export default () => {
  const [search, setSearch] = useState("");

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

  if (businessType === "일반" || businessType === "관리자") {
    return <p>해당 페이지에 접근할 수 없습니다.</p>;
  }

  const filterRequest = requests.filter((request) =>
    request.start_address.replace(/\s+/g, '').includes(search.replace(/\s+/g, '')) ||
    request.arrive_address.replace(/\s+/g, '').includes(search.replace(/\s+/g, ''))
  ).sort((a, b) => new Date(a.move_date) - new Date(b.move_date));

  return (
    <div>
      <div className="max-w-full mx-auto">
        <h1>{user.profile.name}님 환영합니다!</h1>
        <h2>{businessType} 요청서 목록</h2>
        <input
          type="text"
          placeholder="지역 검색(출발지/도착지)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border-gray-300 rounded mb-4"
        />
        {filterRequest.length > 0 ? (
          <ul>
            {filterRequest.map((request) => (
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
                <Link to={`/business/request-details/${request._id}`}>상세 보기</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>현재 요청서가 없습니다.</p>
        )}
        <Link to="businessNavbar" className="mt-10 inline-block">뒤로 가기</Link>
      </div>
    </div>
  );
};