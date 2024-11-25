import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { CollectionRequest } from '/imports/api/collections';
import { Link } from 'react-router-dom';
// import BusinessMyPageNavBar from './BusinessMyPageNavBar';


export default () => {
  const { user, businessType, requests } = useTracker(() => {
    // 구독
    Meteor.subscribe('Users');
    Meteor.subscribe('CollectionRequest');

    const user = Meteor.user();
    const businessType = user.profile.type || null;
    const allRequests = CollectionRequest.find({ submitted: { $ne: true } }).fetch();

    return { 
      user,
      businessType, 
      requests : allRequests,
    };
  });

  if (businessType === "일반" || businessType === "관리자") {
    return <p>해당 페이지에 접근할 수 없습니다.</p>;
  } 

  return (
    <div>
      <h2>{businessType} 요청서 목록</h2>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <p>{request.user_name}님의 이사 견적 요청</p>
              <p>이사 날짜: {new Date(request.move_date).toLocaleDateString()}</p>
              <p>출발지: {request.start_address}</p>
              <p>도착지: {request.arrive_address}</p>
              <p>현재 집 평수: {request.house_size}</p>
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
          ))}
        </ul>
      ) : (
        <p>현재 요청서가 없습니다.</p>
      )}
      {/* <BusinessMyPageNavbar /> */}
    </div>
  );
};