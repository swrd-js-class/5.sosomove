//견적요청서 상세내역 조회
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { CollectionEstConfirm } from "/imports/api/collections";
import "/lib/utils.js";

export default () => {
  const { id } = useParams();
  const navigate = useNavigate();

  //request테이블에서 견적서내용 리스트 뽑기
  const [reqDetail, setReqDetail] = useState([]);
  const [estimateCarList, setEstimateCarList] = useState([]);
  const [estimateHelList, setEstimateHelList] = useState([]);

  const [carBusinessId, setCarBusinessId] = useState(null);
  const [helBusinessId, setHelBusinessId] = useState(null);
  const [carBusiFlag, setCarBisiFlag] = useState(false);
  const [helperBusiFlag, setHelperBusiFlag] = useState(false);

  useEffect(() => {

    //내 견적요청서 조회
    Meteor.call('requestDetailCall', { param: id }, (err, result) => {

      if (err) {
        console.log(err);
        return;
      }
      setReqDetail(result);
      setCarBusinessId(result[0].reqCar.car_confirm_id);
      setHelBusinessId(result[0].reqHelper.hel_confirm_id);
    });

    //사업자 견적서 조회-용달
    Meteor.call('estimateCall', { param: id, business_type: '용달' }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setEstimateCarList(result);
    });

    //사업자 견적서 조회-헬퍼
    Meteor.call('estimateCall', { param: id, business_type: '헬퍼' }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setEstimateHelList(result);
    });
  }, []);


  //매칭내역 확정
  const handleConfirm = () => {
    //용달 업체를 선택해야만(확정되어 있어야만) 매칭 확정될 수 있음
    if (carBusinessId !== null) {

      const isconfirm = window.confirm("선택된 업체를 매칭 확정 하시겠습니까?");

      if (isconfirm) {
        //최종 사업자선택 컨펌
        //견적요청서_car의 car_confirm_id에 update
        //견적요청서_helper의 hel_confirm_id에 update
        Meteor.call('updateRequestConfirmBusiId', { requestId: id, car_businessId: carBusinessId, hel_businessId: helBusinessId }, (error, result) => {
          if (error) {
            consol.log(error);
            return;
          }
        });

        const bizIdList = [];

        if (carBusinessId !== null) bizIdList.push(carBusinessId);
        if (helBusinessId !== null) bizIdList.push(helBusinessId);

        if (bizIdList.length > 0) {
          bizIdList.map((bizId) => {
            Meteor.call('updateEstMatchingFlag', { requestId: id, businessId: bizId, matchingFlag: 2 }, (error, result) => {
              if (error) {
                console.log(error);
                return;
              }
            });
          });
        }

        console.log("update Success!!");
        alert("저장되었습니다.");

        //list 화면으로 이동
        navigate('/mypage/checkrequest');
      } else {
        console.log("취소");
        return;
      }
    } else {
      alert("용달업체를 선택해야만 매칭이 가능합니다.");
      return;
    }
  }


  //삭제
  const handleRequestRemove = () => {
    Meteor.call('removeRequest', { param: id }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        alert("삭제되었습니다.");

        //navigate('/CheckRequest');
        navigate('/mypage/checkrequest');
      }
    });
  }

  //car_radio
  const handleCarRadioChange = (business_id) => {
    setCarBusinessId(business_id);
  }

  //helper_radio
  const handleHelRadioChange = (business_id) => {
    setHelBusinessId(business_id);
  }


  return (
    <div>
      <div>
        {/*내 견적 요청서 조회*/}
        <div className="px-4 sm:px-0">
          <h3 className="ml-4 text-xl leading-7 font-semibold text-gray-900">견적 요청서 확인</h3>
        </div>
        {reqDetail.map((detail) => {
          return (
            <div className=" w-1/2 mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">신청인</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.user_name}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">이사 날짜</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.move_date.toStringYMD()}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">출발지 주소</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.start_address}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">도착지 주소</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.arrive_address}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">평 수</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.house_size}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">인부 추가 여부</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.addworker === true ? '필요' : '필요하지 않음'}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">용달차 도착요청시간</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqCar.req_arr_time}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">출발지 E/V</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqCar.str_addr_elv === true ? '있음' : '없음'}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">도착지 E/V</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqCar.arr_addr_elv === true ? '있음' : '없음'}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">추가 요청사항</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqCar.detail}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">가전</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {
                      detail.reqCar.appliances.length > 0 ?
                        detail.reqCar.appliances.map((app) => {
                          return (
                            <span
                              key={app}
                              className="inline-block mr-2 mb-2 px-3 py-1 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded"
                            >
                              {app}
                            </span>
                          );
                        }) : <span className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0" >없음</span>
                    }
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">가구</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {
                      detail.reqCar.furniture.length > 0 ?
                        detail.reqCar.furniture.map((furniture) => {
                          return (
                            <span
                              key={furniture}
                              className="inline-block mr-2 mb-2 px-3 py-1 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded"
                            >
                              {furniture}
                            </span>
                          );
                        }) : <span className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0" >없음</span>
                    }
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">도우미 요청시간대</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqHelper.request_time_area === "" ? '요청 없음' : detail.reqHelper.request_time_area}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">도우미 도착 요청시간</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqHelper.h_req_arr_time === "" ? '요청 없음' : detail.reqHelper.h_req_arr_time}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">도우미 요청사항</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqHelper.h_type === false ? '요청 없음' : detail.reqHelper.h_type}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">출발지-평 수</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqHelper.s_house_size}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="ml-4 text-sm/6 font-medium text-gray-900">도착지-평 수</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{detail.reqHelper.a_house_size}</dd>
                </div>
              </dl>
            </div>
          )
        })}
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">받은 견적서</h1>
            <p className="mt-2 text-sm text-gray-700">
              용달 사업자
            </p>
          </div>
        </div>
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden overflow-auto shadow ring-1 ring-black/5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 min-h-[100px]">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                    선택
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    사업자번호
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    사업자명
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    연락처
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    견적비용
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    상세내역
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {estimateCarList.map((carestimate, index) => {
                  return (
                    <tr key={carestimate.business_id}>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">
                        <input
                          type="radio"
                          name="carRadio"
                          value={carestimate.business_id}
                          checked={carBusinessId === carestimate.business_id}
                          onChange={() => handleCarRadioChange(carestimate.business_id)}
                        />
                      </td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{carestimate.business_id}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{carestimate.business_name}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{carestimate.business_contact}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{carestimate.amount}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{carestimate.details}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {/* <h1 className="text-base font-semibold text-gray-900">받은 견적서</h1> */}
            <p className="mt-2 text-sm text-gray-700">
              도우미 사업자
            </p>
          </div>
        </div>
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden overflow-auto shadow ring-1 ring-black/5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 min-h-[100px]">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                    선택
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                    사업자번호
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                    사업자명
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                    연락처
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                    견적비용
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">
                    상세내역
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {estimateHelList.map((helestimate) => {
                  return (
                    <tr key={helestimate.business_id}>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">
                        <input
                          type="radio"
                          name="helRadio"
                          value={helestimate.business_id}
                          checked={helBusinessId === helestimate.business_id}
                          onChange={() => handleHelRadioChange(helestimate.business_id)}
                        />
                      </td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{helestimate.business_id}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{helestimate.business_name} </td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{helestimate.business_contact}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{helestimate.amount}</td>
                      <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{helestimate.details}</td>
                    </tr>

                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end max-w-full px-10 mt-5">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 ">
            매칭 확정
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-2 px-2 mb-5">
        <Link to={`/mypage/requestupdate/${id}`}>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            견적요청서 수정
          </button>
        </Link>
        <button
          type="button"
          className="rounded bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleRequestRemove}>
          삭제
        </button>
      </div>
    </div>
  );
};