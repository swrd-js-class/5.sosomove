//개인-마이페이지-이사매칭현황조회
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useParams } from "react-router-dom";
import "/lib/utils.js";

export default () => {
  const userId = Meteor.userId(); //현재 로그인한 사용자의 userId 조회
  const [matchingList, setMatchingList] = useState([]);
  const [bizInfoList, setBizInfoList] = useState([]);
  const [delReqConfirmBizId, setDelReqConfirmBizId] = useState([]); //매칭취소 리스트

  //userid로 모든 request 내역을 끌고온다. list로 보여주면서 matching된 내역을 보여준다.
  //matching되지 않은 request내역은 보여주지 않는다.
  //하나라도 매칭된 내역이 있다면 보여준다.
  //조회된 request내역에서 map을 돌려서 용달/헬퍼 사업자의 id를 빼고, 그 id로 업체 정보를 조회한다.

  useEffect(() => {
    //request 조회
    Meteor.call('requestMatchingListCall', { param: userId }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      setMatchingList(result);
    });
  }, []);

  //matchingList가 변하면 사업자 정보 조회
  useEffect(() => {
    console.log("matchingList 시작: " + matchingList.length);
    if (matchingList.length > 0) {
      matchingList.map((matching) => {
        console.log("map 시작");

        let bizIdList = [];
        let bizInfo = [];

        if (matching.reqCar.car_confirm_id !== null) {
          bizIdList = [...bizIdList, matching.reqCar.car_confirm_id];
        }
        if (matching.reqHelper.hel_confirm_id !== null) {
          bizIdList = [...bizIdList, matching.reqHelper.hel_confirm_id];
        }

        // for (let i = 0; i < bizIdList.length; i++) {
        bizIdList.forEach((bizId) => {
          Meteor.call('bizInfoSearch', { userId: bizId }, (err, result) => {
            if (err) {
              console.log(err);
              return;
            }

            const data = {
              requestId: matching._id,
              start: matching.start_address,
              arrive: matching.arrive_address,
              type: result.profile.type,
              name: result.profile.name,
              phone: result.profile.phone,
              bizId: bizId
            };

            bizInfo = [...bizInfo, data];

            if (bizIdList.length === bizInfo.length) {
              setBizInfoList([...bizInfoList, ...bizInfo]);
            }
          });
        });
      });
    }
  }, [matchingList]);

  // useEffect(() => {
  //   bizInfoList.map((biz, index) => {
  //     console.log("사업자정보리스트 : " + index);
  //     console.log("사업자정보 조회 후 리스트 : " + biz.requestId);
  //   });
  // }, [bizInfoList]);

  //체크박스 체크 시
  const handleCheckBiz = (requestId, type) => {
    const delBizData = { requestId: requestId, type: type };

    setDelReqConfirmBizId((prevSelectedBizId) => {

      const existingIndex = prevSelectedBizId.findIndex((item) => item.requestId === requestId);

      if (existingIndex !== -1) {
        return prevSelectedBizId.filter((item) => item.requestId !== requestId)
      } else {
        return [...prevSelectedBizId, delBizData];
      }
    });
  }

  const handleConfrimCancle = () => {

    if (delReqConfirmBizId.length > 0) {
      const isconfirm = window.confirm("선택된 업체를 매칭 해제 하시겠습니까?");

      if (isconfirm) {
        delReqConfirmBizId.map((delInfo) => {
          Meteor.call('updateRequestConfirmBizId', { requestId: delInfo.requestId, type: delInfo.type }, (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
          });

          alert("매칭이 해제 되었습니다.");
        })

        //새로고침 해야해!!!

      } else {
        console.log("취소");
        return;
      }
    }
  }

  return (
    <>
      <div>
        <table>
          <thead>
            <th>선택</th>
            <th>No.</th>
            <th>업체타입</th>
            <th>출발지</th>
            <th>도착지</th>
            <th>업체명</th>
            <th>연락처</th>
          </thead>
          <tbody>
            {bizInfoList.map((bizInfo, index) => (
              <tr key={bizInfo.requestId} >
                <td>
                  <input
                    type="checkbox"
                    onClick={() => handleCheckBiz(bizInfo.requestId, bizInfo.type)}
                  ></input>
                </td>
                <td>{index}</td>
                <td>{bizInfo.type}</td>
                <td>{bizInfo.start}</td>
                <td>{bizInfo.arrive}</td>
                <td>{bizInfo.name}</td>
                <td>{bizInfo.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={handleConfrimCancle} >매칭 취소</button>
      </div>
    </>
  );
}