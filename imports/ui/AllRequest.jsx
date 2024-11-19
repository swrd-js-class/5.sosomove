import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest } from '/imports/api/collections';
import { Link } from 'react-router-dom';

export default () => {
  const { user, businessType, requests } = useTracker(() => {
    Meteor.subscribe('Users');
    Meteor.subscribe('CollectionRequest');
    Meteor.subscribe('CollectionEstCar');
    Meteor.subscribe('CollectionEstHelper');

    const user = Meteor.user();
    const businessType = user.profile.type || null;

    const allRequests = CollectionRequest.find({}).fetch();

    return {
      user,
      businessType,
      requests: allRequests,
    };
  });

  return (
    <div>
      <h2>{businessType} 요청서 목록</h2>
      {requests.length > 0 ? (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <p>이사 날짜: {new Date(request.move_date).toLocaleDateString()}</p>
              <p>출발지: {request.start_address}</p>
              <p>도착지: {request.arrive_address}</p>
              {businessType === '용달' && (
                <p>인부 추가: {request.addworker ? '1명 추가' : '없음'}</p>
              )} 
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
