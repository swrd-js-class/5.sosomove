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

    //내 견적요청서 조회
    Meteor.call('requestDetailCall', { param: id }, (err, result) => {

      if (err) {
        console.log(err);
        return;
      }
      setReqDetail(result);
    });

    //용달 견적요청서 조회
    Meteor.call('requestEstCarCall', { param: id }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setReqEstCar(result);
    });

    //헬퍼 견적요청서 조회
    Meteor.call('requestHelperCall', { param: id }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setHelper(result);
    });

    //사업자 견적서 조회
    Meteor.call('estimateCall', { param: id }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setEstimateList(result);
    });
  }, []);

  const handleConfirm = () => {

  }

  return (
    <>
      <div>
        <div>
          {/*내 견적 요청서 조회*/}
          {reqDetail.map((detail) => {
            return (
              <div>
                {detail.move_date.toStringYMD()}
                {detail.start_address}
                {detail.arrive_address}
                {detail.house_size}
                {detail.addworker}
                {detail.confirmYN}
              </div>
            )
          })}
        </div>
        <div>
          {reqEstCar.map((estcar) => {
            return (
              <div>
                도착요청시간 : {estcar.req_arr_time}시<tr />
                출발지-e/v : {estcar.str_addr_elv}<tr />
                도착지-e/v : {estcar.arr_addr_elv}<tr />
                사다리차 필요 여부<tr />
                출발지 : {estcar.ladder_truck.start == "true" ? (
                  <input type='checkbox' checked />
                ) : <input type='checkbox' />
                }<tr />
                도착지 {estcar.ladder_truck.arrive == "true" ? (
                  <input type='checkbox' checked />
                ) : <input type='checkbox' />
                }<tr />
                가전 {
                  estcar.appliances.map((app) => {
                    <button disabled="true">{app}</button>
                  }
                  )
                }<tr />
                가구 {
                  estcar.funiture.map((funiture) => {
                    <input type='text' readOnly>{funiture}</input>
                  }
                  )
                }
              </div>
            )
          })}
        </div>
        <div>
          {reqHelper.map((helper) => {
            return (
              <div>
                요청시간대 : {helper.request_time_area}<tr />
                요청사항 : {helper.h_type}<tr />
                도착요청시간 : {helper.h_req_arr_time}<tr />
                평-출발 : {helper.s_house_size}<tr />
                평-도착 : {helper.a_house_size}<tr />
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <h2>받은 견적서</h2>
        {estimateList.map((estimate) => {
          return (
            <div>
              업체명 : {estimate.business_name} <tr />
              연락처 : {estimate.business_contect}<tr />
              도착시간 : {estimate.arrival_time}<tr />
              가격 : {estimate.amount}<tr />
              상세내역 : {estimate.details}<tr />
              <button onClick={() => handleConfirm(estimate.business_id)}>컨펌</button>
            </div>
          )
        })}
      </div>
    </>
  );
};

