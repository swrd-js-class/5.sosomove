//견적요청서 상세내역 조회
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useParams } from "react-router-dom";
import "/lib/utils.js";

export default () => {
  const { id } = useParams();

  //request테이블에서 견적서내용 리스트 뽑기
  const [reqDetail, setReqDetail] = useState([]);
  const [reqEstCar, setReqEstCar] = useState([]);
  const [reqHelper, setHelper] = useState([]);
  const [estimateList, setEstimateList] = useState([]);

  useEffect(() => {

    console.log("****userId : " + id);


    //내 견적요청서 조회
    Meteor.call('requestDetailCall', id, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setReqDetail(result);
    });

    //용달 견적요청서 조회
    Meteor.call('requestEstCarCall', id, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setReqEstCar(result);
    });

    //헬퍼 견적요청서 조회
    Meteor.call('requestHelperCall', id, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setHelper(result);
    });

    //사업자 견적서 조회
    Meteor.call('estimateCall', id, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setEstimateList(result);
    });
  }, []);

  return (
    <>
      <div>
        {/*내 견적 요청서 조회*/}
        {reqDetail.map((detail) => {
          return (
            <div>
              {reqDetail.move_date.toStringYMD()}
              {reqDetail.start_address}
              {reqDetail.arrive_address}
              {reqDetail.house_size}
              {reqDetail.addworker}
              {reqDetail.confirmYN}
            </div>
          )
        })}
        {/*내 견적 요청서 조회-용달*/}
        {reqEstCar.map((estcar) => {
          return (
            <div>
              도착요청시간 <input type='text' readOnly>{estcar.req_arr_time}</input>
              출발지-e/v <input type='text' readOnly>{estcar.str_addr_elv}</input>
              도착지-e/v <input type='text' readOnly>{estcar.arr_addr_elv}</input>
              사다리차 필요 여부<tr />
              출발지 {estcar.ladder_truck.start == "true" ? (
                <input type='checkbox' checked />
              ) : <input type='checkbox' />
              }
              도착지 {estcar.ladder_truck.arrive == "true" ? (
                <input type='checkbox' checked />
              ) : <input type='checkbox' />
              }
              가전 <input type='text' readOnly>{estcar.appliances}</input>
              가구 <input type='text' readOnly>{estcar.funiture}</input>
            </div>
          )
        })}
        {/*내 견적 요청서 조회-헬퍼 */}
        {reqHelper.map((helper) => {
          return (
            <div>
              요청시간대 <input type='text' readOnly>{helper.request_time_area}</input>
              요청사항 <input type='text' readOnly>{helper.h_type}</input>
              도착요청시간 <input type='text' readOnly>{helper.h_req_arr_time}</input>
              평-출발 <input type='text' readOnly>{helper.s_house_size}</input>
              평-도착 <input type='text' readOnly>{helper.a_house_size}</input>
            </div>
          )
        })}
      </div>
      <div>
        <h2>견적서</h2>
        {estimateList.map((estimate) => {
          return (
            <div>
              {estimate.business_name}
              {estimate.business_contact}
              {estimate.arrival_time}
              {estimate.amount}
              {estimate.details}
            </div>
          )
        })}
      </div>
      <div>You page is not found. [404]</div>;
    </>
  );
};