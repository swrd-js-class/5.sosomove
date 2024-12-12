//견적서확인 페이지
import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Link } from 'react-router-dom';
import "/lib/utils.js";

export default () => {
    //~님 환영합니다
    const [user, setUser] = useState('');
    const userId = Meteor.userId();
    Meteor.call('userSearch', { param: userId }, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        setUser(result);
    })

    //   const userId = Meteor.userId();

    //request테이블에서 견적서내용 리스트 뽑기
    const [requestList, setRequestList] = useState([]);

    //알림
    const [reservations, setReservations] = useState([]);
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        Meteor.call('requestListCall', { param: userId }, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            setRequestList(result);

            // 예약 내역에서 '오늘로부터 7일 이내' 날짜가 있는지 체크
            checkUpcomingReservations(result);
        });
    }, []);

    // '오늘로부터 7일 이내'인 예약을 체크하는 함수
    const checkUpcomingReservations = (reservations) => {
        const today = new Date();
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);

        for (const reservation of reservations) {
            const reservationDate = new Date(reservation.move_date); // 예약 날짜가 'date' 필드에 있다고 가정
            if (reservationDate >= today && reservationDate <= sevenDaysLater) {
                setShowAlert(true);
                break;  // 하나라도 찾으면 알림을 띄우고 종료
            }
        }
    };

    // 알림 닫기
    const closeAlert = () => {
        setShowAlert(false);
    };


    return (
        <>
            <div>
                {showAlert && (
                    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-4 rounded-lg shadow-lg text-xl flex items-center justify-between z-50 animate-pulse">
                        <span>곧 다가오는 예약이 있습니다!</span>
                        <button onClick={closeAlert} className="ml-4 bg-white text-black rounded-full p-2">닫기</button>
                    </div>
                )}
            </div>

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <p>{user}님 환영합니다!</p>
                        <h1 className="mt-6 text-base font-semibold text-gray-900">내 견적 요청서</h1>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link to={'/mypage/newRequest'}>
                            <button type="button" className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                                새 견적 요청
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden border border-gray-300 shadow ring-1 ring-black/5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6">작성일</th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">신청자</th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">이삿날</th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">출발지</th>
                                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">도착지</th>
                                            <th scope="col" className="relative py-3.5 text-center pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">상세보기</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {requestList.map((request) => (
                                            <tr key={request._id}>
                                                <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{request.createdAt.toStringYMD()}</td>
                                                <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{request.user_name}</td>
                                                <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{request.move_date.toStringYMD()}</td>
                                                <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{request.start_address}</td>
                                                <td className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500">{request.arrive_address}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Link to={`/mypage/requestdetail/${request._id}`} className="text-indigo-600 hover:text-indigo-900">
                                                        상세보기
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};