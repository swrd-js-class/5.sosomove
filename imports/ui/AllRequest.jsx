// 견적 요청서 전체 확인

// if 용달일 경우 CollectionRequest, CollectionEstCar가 보여야함
// else if 헬퍼일 경우 CollectionRequest, CollectionEstHelper가 보여야함
// else 관리자인 경우 전부 확인 가능하기

// import React from 'react';
// import { useTracker } from 'meteor/react-meteor-data';
// import { CollectionRequest } from '/imports/api/collections';
// import { Meteor } from 'meteor/meteor';
// import { Link } from 'react-router-dom';

// export default () => {
//   const requestList = () => {}
//   const user = useTracker(() => Meteor.user());
//   const businessType = user && user.profile ? user.profile.type : null;
//   const allRequests = CollectionRequest.find({}).fetch();

//     // 사업자 타입에 따라 요청 필터링
//     const filterRequest = allRequests.filter((request) => {
//       if (businessType === "용달") {
//         return request.profiletype === "일반" || request.profiletype === "용달";
//       } else if (businessType === "헬퍼") {
//         return request.profiletype === "일반" || request.profiletype === "헬퍼";
//       }
//       return false;
//     });

//     return {
//       requestList: filterRequest,
//       businessType,
//     };

//   return (
//     <div>
//       <h2>요청서 목록</h2>
//       <ul>
//         {requestList.map((request) => (
//           <li key={request._id}>
//             <p>요청 ID: {request._id}</p>
//             <p>출발지: {request.start_address}</p>
//             <p>도착지: {request.arrive_address}</p>
//             <p>이사 날짜: {request.move_date}</p>
//             <Link to={`/estimate/${request._id}`}>
//               견적서 작성하기
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest, CollectionEstCar, CollectionEstHelper } from '/imports/api/collections';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

export default () => {
  // 사용자 및 요청 데이터 추적
  const { user, requestList, businessType } = useTracker(() => {
    const user = Meteor.user();
    const businessType = user.profile.type || null;

    // 요청 데이터 필터링
    let filteredRequests = [];
    if (businessType === "용달") {
      const carRequests = CollectionEstCar.find({}).fetch();
      filteredRequests = carRequests.map((carRequest) => ({
        ...carRequest,
        ...CollectionRequest.findOne({ _id: carRequest.request_id }),
      }));
    } else if (businessType === "헬퍼") {
      const helperRequests = CollectionEstHelper.find({}).fetch();
      filteredRequests = helperRequests.map((helperRequest) => ({
        ...helperRequest,
        ...CollectionRequest.findOne({ _id: helperRequest.request_id }),
      }));
    }

    return {
      user,
      requestList: filteredRequests,
      businessType,
    };
  });

  return (
    <div>
      <h2>요청서 목록</h2>
      {requestList.length > 0 ? (
        <ul>
          {requestList.map((request) => (
            <li key={request._id}>
              <h3>요청 ID: {request._id}</h3>
              <p>출발지: {request.start_address}</p>
              <p>도착지: {request.arrive_address}</p>
              <p>이사 날짜: {new Date(request.move_date).toLocaleDateString()}</p>
              <p>요청 유형: {request.reqType || "일반"}</p>

              {/* 용달 요청 세부 정보 */}
              {businessType === "용달" && (
                <div>
                  <h4>용달 요청 세부 사항</h4>
                  <p>도착 요청 시간: {request.req_arr_time}시</p>
                  <p>출발지 엘리베이터: {request.str_addr_elv === "Y" ? "있음" : "없음"}</p>
                  <p>도착지 엘리베이터: {request.arr_addr_elv === "Y" ? "있음" : "없음"}</p>
                  <p>사다리차 사용: {`출발: ${request.ladder_truck?.start}, 도착: ${request.ladder_truck?.arrive}`}</p>
                  <p>가전: {Object.entries(request.appliances).map(([key, value]) => `${key}: ${value === "Y" ? "포함" : "불포함"}`).join(", ")}</p>
                  <p>가구: {Object.entries(request.funiture).map(([key, value]) => `${key}: ${value === "Y" ? "포함" : "불포함"}`).join(", ")}</p>
                </div>
              )}

              {/* 헬퍼 요청 세부 정보 */}
              {businessType === "헬퍼" && (
                <div>
                  <h4>헬퍼 요청 세부 사항</h4>
                  <p>요청 시간대: {request.request_time_area}</p>
                  <p>요청 유형: {request.h_type}</p>
                  <p>출발 집 평수: {request.s_house_size}평</p>
                  <p>도착 집 평수: {request.a_house_size}평</p>
                </div>
              )}

              <Link to={`/estimate/${request._id}`}>견적서 작성하기</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>관련 요청서가 없습니다.</p>
      )}
    </div>
  );
};
