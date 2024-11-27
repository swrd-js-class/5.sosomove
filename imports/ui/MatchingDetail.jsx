//개인-마이페이지-이사매칭현황조회
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useParams } from "react-router-dom";
import "/lib/utils.js";

export default () => {
  const userId = Meteor.userId(); //현재 로그인한 사용자의 userId 조회
  const [matchingList, setMatchingList] = useState([]);

  console.log("userId : " + userId);

  const [newCompileDate, setNewCompileData] = useState([]); // 최종 수정된 데이터(id, 출발지, 도착지, 용달업체 이름, 용달업체 연락처, 헬퍼업체 이름, 헬퍼업체 연락처)

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

    console.log("시작은 했다아아아아");
  }, []);

  //matchingList가 변하면 사업자 정보 조회
  useEffect(() => {
    console.log("matchingList 시작: " + matchingList.length);
    if (matchingList.length > 0) {
      matchingList.map((matching) => {
        console.log("map 시작");

        const [bizIdList, setBizIdList] = useState([]);
        const [bizInfo, setBizInfo] = useState([]);
        const [compileInfo, setCompileInfo] = useState({});

        if (matching.reqCar.car_confirm_id !== null) {
          setBizIdList([...bizIdList, matching.reqCar.car_confirm_id]);
        }
        if (matching.reqHelper.hel_confirm_id !== null) {
          setBizIdList([...bizIdList, matching.reqHelper.hel_confirm_id]);
        }

        for (let i = 0; i < bizIdList.length; i++) {
          Meteor.call('bizInfoSearch', { param: bizId[i] }, (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            setBizInfo([...bizInfo, result]);
          });
        }

        const str = { requesId: matching._id, start: matching.start_address, arrive: matching.arrive_address, };
        setCompileInfo(str);

        for (let j = 0; j < bizInfo.length; j++) {
          if (bizInfo[j].profile.type === '용달') {
            const car = {
              type: '용달',
              bizName: bizInfo[j].profile.name,
              phone: bizInfo[j].profile.phone
            }

            setCompileInfo(prevState => ({
              ...prevState, // 이전 상태를 복사
              car // 객체 추가
            }));
          }
          else if (bizInfo[j].profile.type === '헬퍼') {
            const helper = {
              type: '헬퍼',
              bizName: bizInfo[j].profile.name,
              phone: bizInfo[j].profile.phone
            }

            setCompileInfo(prevState => ({
              ...prevState, // 이전 상태를 복사
              helper // 객체 추가
            }));
          }
        }

        setNewCompileData([...newCompileDate, compileInfo]);
      })
    }
  }, [matchingList]);

  return (
    <>
      <div>
        <table>
          <thead>
            <th>No.</th>
            <th>출발지</th>
            <th>도착지</th>
            <th>용달업체</th>
            <th>용달업체 연락처</th>
            <th>헬퍼업체</th>
            <th>헬퍼업체 연락처</th>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    </>
  );
}