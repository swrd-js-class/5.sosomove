import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionEstCar, CollectionEstHelper } from '/imports/api/collections';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { CollectionRequest } from '../api/collections';

export default() => {
  const { user, businessType, requests } = useTracker(() => {
    const user = Meteor.user();
    const businessType = user?.profile?.type || null;

    const allRequest = CollectionRequest.find({}).fetch();

    return {
      user,
      businessType,
      requests : allRequest,
    };
  });

  return (
    <div>
      <h2> {businessType} 요청서 목록 </h2>
      {requests.length > 0 ? (
       <ul>
       {requests.map((request) => (
         <li key={request._id}>
            <p>이사 날짜 : {new Date(request.move_date).toLocalDateString()}</p>
            <p>출발지: {request.start_address}</p>
            <p>도착지: {request.arrive_address}</p>
            {businessType === '용달' && <p>인부 추가: {request.addworker ? '1명 추가' : '없음'}</p>}
              {/* {businessType === '헬퍼' && (
                <>
                  <p>요청 시간대: {request.helperrequest?.request_time_area || '정보 없음'}</p>
                  <p>요청 사항: {request.helperrequest?.h_type || '정보 없음'}</p>
                </> */}
              {/* )} */}
              <Link to={`/request-details/${request._id}`}>견적 요청 작성</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>현재 요청서가 없습니다.</p>
      )}
    </div>
  );
};