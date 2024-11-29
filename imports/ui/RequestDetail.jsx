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


  //컨펌내역 확정
  const handleConfirm = () => {

    if (carBusinessId !== null || helBusinessId !== null) {

      const isconfirm = window.confirm("선택된 업체를 저장하시겠습니까?");

      if (isconfirm) {
        //최종 사업자선택 컨펌
        //견적요청서_car의 car_confirm_id에 update
        //견적요청서_helper의 hel_confirm_id에 update
        Meteor.call('updateRequestConfirmBusiId', { requestId: id, car_businessId: carBusinessId, hel_businessId: helBusinessId }, (err, result) => {
          if (err) {
            consol.log(err);
            return;
          }
          console.log("update Success!!");
          alert("저장되었습니다.");

          //list 화면으로 이동
          //navigate('/CheckRequest');
          navigate('/mypage/checkrequest');
        });
      }
    } else {
      console.log("취소");
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
    <>
      <div>
        <div>
          {/*내 견적 요청서 조회*/}
          {reqDetail.map((detail) => {
            return (
              <div>
                <h3>견적 요청서</h3>
                {detail.move_date.toStringYMD()}
                {detail.start_address}
                {detail.arrive_address}
                {detail.house_size}
                {detail.addworker}
                <tr />
                <h3>용달 요청서</h3>
                도착요청시간 : {detail.reqCar.req_arr_time}시<tr />
                출발지-e/v : {detail.reqCar.str_addr_elv === true ? (
                  <input type='checkbox' checked />
                ) : <input type='checkbox' />
                }<tr />
                도착지-e/v : {detail.reqCar.arr_addr_elv === true ? (
                  <input type='checkbox' checked />
                ) : <input type='checkbox' />
                }<tr />
                사다리차 필요 여부<tr />
                출발지 : {detail.reqCar.ladder_truck.start === true ? (
                  <input type='checkbox' checked />
                ) : <input type='checkbox' />
                }<tr />
                도착지 {detail.reqCar.ladder_truck.arrive === true ? (
                  <input type='checkbox' checked />
                ) : <input type='checkbox' />
                }<tr />
                가전 {
                  detail.reqCar.appliances.length > 0 ?
                    detail.reqCar.appliances.map((app) => {
                      return <button style={{ border: '1px solid black' }}>{app}</button>
                    }) : <button />
                }<tr />
                가구 {
                  detail.reqCar.furniture.length > 0 ?
                    detail.reqCar.furniture.map((furniture) => {
                      return <button style={{ border: '1px solid black' }}>{furniture}</button>
                    }) : <button />
                }<tr />
                <h3>도우미 요청서</h3>
                요청시간대 : {detail.reqHelper.request_time_area}<tr />
                요청사항 : {detail.reqHelper.h_type}<tr />
                도착요청시간 : {detail.reqHelper.h_req_arr_time}<tr />
                평-출발 : {detail.reqHelper.s_house_size}<tr />
                평-도착 : {detail.reqHelper.a_house_size}<tr />
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <h2>받은 견적서</h2>
        <h3>용달 업체</h3>
        <div>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>선택</th>
                <th>사업자번호</th>
                <th>업체명</th>
                <th>연락처</th>
                <th>가격</th>
                <th>상세내역</th>
              </tr>
            </thead>
            <tbody>
              {estimateCarList.map((carestimate, index) => {
                return (
                  <tr key={carestimate.business_id}>
                    <td>
                      <input
                        type="radio"
                        name="carRadio"
                        value={carestimate.business_id}
                        checked={carBusinessId === carestimate.business_id}
                        onChange={() => handleCarRadioChange(carestimate.business_id)}
                      />
                    </td>
                    <td>{carestimate.business_id}</td>
                    <td>{carestimate.business_name}</td>
                    <td>{carestimate.business_contact}</td>
                    <td>{carestimate.amount}</td>
                    <td>{carestimate.details}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <h3>도우미 업체</h3>
        <div>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>선택</th>
                <th>사업자번호</th>
                <th>업체명</th>
                <th>연락처</th>
                <th>가격</th>
                <th>상세내역</th>
              </tr>
            </thead>
            <tbody>
              {estimateHelList.map((helestimate) => {
                return (
                  <tr key={helestimate.business_id}>
                    <td>
                      <input
                        type="radio"
                        name="helRadio"
                        value={helestimate.business_id}
                        checked={helBusinessId === helestimate.business_id}
                        onChange={() => handleHelRadioChange(helestimate.business_id)}
                      />
                    </td>
                    <td>{helestimate.business_id}</td>
                    <td>{helestimate.business_name} </td>
                    <td>{helestimate.business_contact}</td>
                    <td>{helestimate.amount}</td>
                    <td>{helestimate.details}</td>
                  </tr>

                )
              })}
            </tbody>
          </table>
        </div>
        <div><button onClick={handleConfirm}>컨펌 확정</button></div>
        <div>
          <Link to={`/mypage/requestupdate/${id}`}>
            <button>견적요청서 수정</button>
          </Link>
        </div>
        <div>
          <button onClick={handleRequestRemove}>삭제</button>
        </div>
      </div>
    </>
  );
};