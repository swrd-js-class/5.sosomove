import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest } from '/imports/api/collections';
import { Link } from 'react-router-dom';


export default () => {
  const { id } = useParams();

  const { request, businessType } = useTracker(() => {
    Meteor.subscribe('CollectionRequest');

    const user = Meteor.user();
    const request = CollectionRequest.findOne({ _id: id });
    const businessType = user.profile.type || null;

    return {
      request,
      businessType,
    };
  });

  if (!request) {
    return <p>요청 데이터를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h2> {request.user_name}님 견적 요청서 상세</h2>
      <p>출발지: {request.start_address}</p>
      <p>도착지: {request.arrive_address}</p>
      <p>이사 날짜: {new Date(request.move_date).toLocaleDateString()}</p>

      {businessType === '용달' && request && (
        <div>
          <p>도착 요청 시간: {request.reqCar.req_arr_time}시</p>
          <p>출발지 엘리베이터 여부: {request.reqCar.str_addr_elv ? '있음' : '없음'}</p>
          <p>도착지 엘리베이터 여부: {request.reqCar.arr_addr_elv ? '있음' : '없음'}</p>
          <p>출발지 사다리차 여부: {request.reqCar.ladder_truck.start ? '있음' : '없음'}</p>
          <p>도착지 사다리차 여부: {request.reqCar.ladder_truck.arrive ? '있음' : '없음'}</p>
          <p>가전제품:</p>
          <ul>{request.reqCar.appliances.map((item, index) => (
            <li key={index}>{item}</li>
          ))}</ul>
          <p>가구:</p>
          <ul>{request.reqCar.furniture.map((i, index) => (
            <li key={index}>{i}</li>
          ))}</ul>
          <p>상세 내용: {request.reqCar.detail}</p>
        </div>
      )}

      {businessType === '헬퍼' && request && (
        <div>
          <p>요청 시간대: {request.reqHelper.request_time_area}</p>
          <p>요청 사항: {request.reqHelper.h_type}</p>
          <p>도착 요청 시간: {request.reqHelper.h_req_arr_time}시</p>
          <p>출발지 평수: {request.reqHelper.s_house_size}평</p>
          <p>도착지 평수: {request.reqHelper.s_house_size}평</p>
        </div>
      )}
      <div>
        <Link to={`/business/businessestimate/${id}`}>견적서 작성</Link>
      </div>
    </div>
  );
};
