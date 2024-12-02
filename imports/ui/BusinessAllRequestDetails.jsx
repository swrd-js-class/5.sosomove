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
    return <p className="text-center text-gray-600 mt-10">요청 데이터를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="px-4 sm:px-0">
      <h1 className="ml-4 mt-6 text-base font-semibold text-gray-900">{request.user_name}님 견적 요청서 상세</h1>
      <div className="mt-6 border-t border-gray-100 w-full">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="ml-4 text-sm/6 font-medium text-gray-900">이사 날짜</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{new Date(request.move_date).toLocaleDateString()}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="ml-4 text-sm/6 font-medium text-gray-900">출발지</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{request.start_address}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="ml-4 text-sm/6 font-medium text-gray-900">도착지</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{request.arrive_address}</dd>
          </div>
  
          {businessType === '용달' && request && (
            <>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">도착 요청 시간</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{request.reqCar.req_arr_time}시</dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">엘리베이터 여부</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                  출발지: {request.reqCar.str_addr_elv ? '있음' : '없음'}, 도착지: {request.reqCar.arr_addr_elv ? '있음' : '없음'}
                </dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">사다리차 필요 여부</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                  출발지: {request.reqCar.ladder_truck.start ? '있음' : '없음'}, 도착지: {request.reqCar.ladder_truck.arrive ? '있음' : '없음'}
                </dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">가전제품</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul>
                    {request.reqCar.appliances.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">가구</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                  <ul>
                    {request.reqCar.furniture.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">상세 내용</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{request.reqCar.detail}</dd>
              </div>
            </>
          )}
  
          {businessType === '헬퍼' && request && (
            <>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">요청 시간대</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{request.reqHelper.request_time_area}</dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">도착 요청 시간</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{request.reqHelper.h_req_arr_time}시</dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">출발지 평수</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{request.reqHelper.s_house_size}평</dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">도착지 평수</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{request.reqHelper.d_house_size}평</dd>
              </div>
  
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="ml-4 text-sm font-medium text-gray-900">요청 사항</dt>
                <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{request.reqHelper.h_type}</dd>
              </div>
            </>
          )}
  
          <div className="text-center mt-12">
            <Link 
              to={`/business/businessestimate/${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              견적서 작성
            </Link>
          </div>
        </dl>
      </div>
    </div>
  );
}
