// 견적 요청서 전체 확인

// if 용달일 경우 CollectionRequest, CollectionEstCar가 보여야함
// else if 헬퍼일 경우 CollectionRequest, CollectionEstHelper가 보여야함
// else 관리자인 경우 전부 확인 가능하기

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest } from '/imports/api/collections';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

export default () => {
  const user = useTracker(() => Meteor.user());
  const businessType = user && user.profile ? user.profile.type : null;
  const allRequests = CollectionRequest.find({}).fetch();

    // 사업자 타입에 따라 요청 필터링
    const filterRequest = allRequests.filter((request) => {
      if (businessType === "용달") {
        return request.profiletype === "일반" || request.profiletype === "용달";
      } else if (businessType === "헬퍼") {
        return request.profiletype === "일반" || request.profiletype === "헬퍼";
      }
      return false;
    });

    return {
      requestList: filterRequest,
      businessType,
    };

  return (
    <div>
      <h2>요청서 목록</h2>
      <ul>
        {requestList.map((request) => (
          <li key={request._id}>
            <p>요청 ID: {request._id}</p>
            <p>출발지: {request.start_address}</p>
            <p>도착지: {request.arrive_address}</p>
            <p>이사 날짜: {request.move_date}</p>
            <Link to={`/estimate/${request._id}`}>
              견적서 작성하기
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};