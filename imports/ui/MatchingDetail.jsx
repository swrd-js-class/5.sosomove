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

    if (matchingList.length > 0) {
      let bizInfo = [];

      const fetchBizInfo = async () => {

        const promises = matchingList.map(async (matching, index) => {
          console.log("map 시작");

          let bizIdList = [];

          if (matching.reqCar.car_confirm_id !== null) {
            bizIdList = [...bizIdList, matching.reqCar.car_confirm_id];
          }
          if (matching.reqHelper.hel_confirm_id !== null) {
            bizIdList = [...bizIdList, matching.reqHelper.hel_confirm_id];
          }

          const bizPromises = bizIdList.map((bizId) =>
            new Promise((resolve, reject) => {
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
                resolve();
              });
            })
          );

          //모든 bizId에 대한 요청이 완료되면 bizPromises배열을 기다림
          await Promise.all(bizPromises);
        });

        //matchingList에 대한 모든 처리 후 bizInfo를 업데이트
        await Promise.all(promises);

        //모든 비동기 작업이 완료된 후에 setBizInfoList를 호출
        setBizInfoList((prevBizInfoList) => [...prevBizInfoList, ...bizInfo]);

      };

      fetchBizInfo();
    }
  }, [matchingList]);


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

  // useEffect(() => {
  const handleConfrimCancle = async () => {

    if (delReqConfirmBizId.length > 0) {
      const isconfirm = window.confirm("선택된 업체를 매칭 해제 하시겠습니까?");

      if (isconfirm) {
        const promises = delReqConfirmBizId.map((delInfo) => {
          return new Promise((resolve, reject) => {
            Meteor.call('updateRequestConfirmBizId', { requestId: delInfo.requestId, type: delInfo.type }, (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        });

        //모든 비동기 작업이 완료될 때까지 기다림
        try {
          await Promise.all(promises);

          //매칭 해제 후 상태 업데이트
          setBizInfoList((prevBizInfo) => {
            return prevBizInfo.filter((bizInfo) => {
              return !delReqConfirmBizId.some((delInfo) => delInfo.requestId === bizInfo.requestId && delInfo.type === bizInfo.type);
            });
          });

          alert("매칭이 해제 되었습니다.");
        } catch (err) {
          console.log("비동기 처리 중 오류 발생 : " + err);
        }
      } else {
        console.log("취소");
        return;
      }
    }
  };
  // handleConfrimCancle();
  // }, [delReqConfirmBizId]);

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
                <td>{index + 1}</td>
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