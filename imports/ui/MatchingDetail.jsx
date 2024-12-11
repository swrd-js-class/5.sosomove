//개인-마이페이지-이사매칭현황조회
import React, { useCallback, useEffect, useState } from "react";
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

        const promises = matchingList.map(async (matching) => {
          console.log("map 시작");

          let bizIdList = [];

          if (matching.reqCar.car_confirm_id !== null) {
            bizIdList = [...bizIdList, matching.reqCar.car_confirm_id];
          }
          if (matching.reqHelper.hel_confirm_id !== null) {
            bizIdList = [...bizIdList, matching.reqHelper.hel_confirm_id];
          }

          const bizPromises = bizIdList.map((bizId, index) =>
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
                  bizId: bizId,
                  keyIndex: matching._id + index.toString()
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
  const handleCheckBiz = (requestId, type, bizId, keyIndex) => {
    const delBizData = { requestId: requestId, type: type, bizId: bizId, delIndex: keyIndex };

    setDelReqConfirmBizId((prevSelectedBizId) => {
      const existingIndex = prevSelectedBizId.findIndex((item) => item.delIndex === keyIndex);

      if (existingIndex !== -1) {
        return prevSelectedBizId.filter((item) => item.delIndex !== keyIndex)
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
            Meteor.call('updateRequestConfirmBizId', { requestId: delInfo.requestId, type: delInfo.type, bizId: delInfo.bizId }, (err, result) => {
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
              return !delReqConfirmBizId.some((delInfo) => {
                return delInfo.delIndex === bizInfo.keyIndex;
              });
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
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">매칭 목록</h1>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg relative w-full">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6 w-15">
                        선택
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-15">
                        No.
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-40">
                        업체타입
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-40">
                        출발지
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-40">
                        도착지
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-40">
                        업체명
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 w-40">
                        연락처
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {bizInfoList.map((bizInfo, index) => (
                      // <tr key={bizInfo.requestId}>
                      <tr key={bizInfo.keyIndex}>
                        <td className="text-center px-3 py-4">
                          <input
                            type="checkbox"
                            onClick={() => handleCheckBiz(bizInfo.requestId, bizInfo.type, bizInfo.bizId, bizInfo.keyIndex)}
                          />
                        </td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{bizInfo.type}</td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{bizInfo.start}</td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{bizInfo.arrive}</td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{bizInfo.name}</td>
                        <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{bizInfo.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex justify-end">
                <button
                  type="button"
                  onClick={handleConfrimCancle}
                  className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  매칭 취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}