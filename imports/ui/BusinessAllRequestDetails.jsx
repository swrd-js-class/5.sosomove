import React from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest, CollectionEstCar, CollectionEstHelper } from '/imports/api/collections';
import { Link } from 'react-router-dom';


export default () => {
  const { id } = useParams();

  const { request, businessType, carData, helperData } = useTracker(() => {
    Meteor.subscribe('CollectionRequest');
    Meteor.subscribe('CollectionEstCar');
    Meteor.subscribe('CollectionEstHelper');

    const request = CollectionRequest.findOne({ _id: id });
    const carData = CollectionEstCar.findOne({ request_id: id });
    const helperData = CollectionEstHelper.findOne({ request_id: id });

    const user = Meteor.user();
    const businessType = user.profile.type || null;

    return {
      request,
      businessType,
      carData,
      helperData,
    };
  });

  if (!request) {
    return <p>요청 데이터를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h2> {request.user_name}님 요청 상세보기</h2>
      <p>출발지: {request.start_address}</p>
      <p>도착지: {request.arrive_address}</p>
      <p>이사 날짜: {new Date(request.move_date).toLocaleDateString()}</p>

      {businessType === '용달' && carData && (
        <div>
          <p>도착 요청 시간: {carData.req_arr_time}시</p>
          <p>출발지 엘리베이터 여부: {carData.str_addr_elv}</p>
          <p>도착지 엘리베이터 여부: {carData.arr_addr_elv}</p>
          <p>출발지 사다리차 여부: {carData.ladder_truck.start}</p>          
          <p>도착지 사다리차 여부: {carData.ladder_truck.arrive}</p>
          <p>가전제품:</p> 
          <ul>{carData.appliances.map((item, index) => (
            <li key={index}>{item}</li>
          ))}</ul>
          <p>가구:</p> 
          <ul>{carData.furniture.map((i, index) => (
            <li key={index}>{i}</li>
          ))}</ul>
          <p>상세 내용: {carData.detail}</p>
          <p>사진 {carData.picture}</p>
        </div>
      )}

      {businessType === '헬퍼' && helperData && (
        <div>
          <p>요청 시간대: {helperData.request_time_area}</p>
          <p>요청 사항: {helperData.h_type}</p>
          <p>도착 요청 시간: {helperData.h_req_arr_time}시</p>
          <p>출발지 평수: {helperData.s_house_size}평</p>
          <p>도착지 평수: {helperData.s_house_size}평</p>
          <p>사진 {helperData.picture}</p>
        </div>
      )}
    <div>
    <Link to={`/businessestimate/${id}`}>견적서 작성</Link>
    </div>
    </div>
  );
};
