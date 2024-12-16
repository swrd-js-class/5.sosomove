import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest } from '/imports/api/collections';
import { useParams, useNavigate } from 'react-router-dom';

export default () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [estimateMoney, setEstimateMoney] = useState('');
    const [estimate, setEstimate] = useState('');

    // useTracker를 사용하여 데이터를 가져옴
    const { estRequest, currentUser, business_type } = useTracker(() => {
        Meteor.subscribe('CollectionRequest');
        const allData = CollectionRequest.find({}).fetch();
        const user = Meteor.user();
        const business_type = user?.profile?.type || null;

        return { estRequest: allData, currentUser: user, business_type };
    }, []);

    // 요청을 찾음
    const currentRequest = estRequest.find(request => request._id === id);

    // 요청이 없을 경우 기본 메시지 반환
    if (!currentRequest) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-600">요청 정보를 불러올 수 없습니다.</p>
            </div>
        );
    }

    // estimate, estimateMoney 상태 업데이트 함수
    const handleEstimate = (e) => {
        setEstimate(e.target.value);
    };

    const handleEstimateMoney = (e) => {
        setEstimateMoney(e.target.value);
    };

    // 제출 시 처리 함수
    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!estimateMoney || estimateMoney <= 0) {
            alert('유효한 견적 비용을 입력해주세요');
            return;
        }

        if (!estimate.trim()) {
            alert('견적 상세 내용을 입력해주세요');
            return;
        }

        // 견적 데이터 준비
        const estimateData = {
            request_id: id,
            business_id: currentUser._id,
            business_name: currentUser.profile.name,
            business_contact: currentUser.profile.phone,
            details: estimate.trim(),
            amount: Number(estimateMoney),
            status: 1,
            business_type,
        };

        // 서버로 데이터 전송
        Meteor.call('estimate.insert', estimateData, (err, res) => {
            if (err) {
                alert('견적서 저장 중 오류가 발생했습니다: ' + err.reason);
            } else {
                alert(res); // 서버에서 반환된 메시지 표시
                setEstimate('');
                setEstimateMoney('');
                navigate('/business/allrequest');
            }
        });
    };

    return (
        <>
            <div className="mt-6 px-4 sm:px-0">
                <h3 className="ml-4 text-xl leading-7 font-semibold text-gray-900">견적서 작성</h3>
            </div>
            <div className=" w-1/2 mt-6 border-t border-gray-100 w-full">
                <dl className="divide-y divide-gray-100">
                    {/* 요청 정보 섹션 */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="ml-4 text-sm font-medium text-gray-900">요청인</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{currentRequest.user_name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="ml-4 text-sm font-medium text-gray-900">사업자명</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{currentUser?.profile?.name}</dd>
                    </div>
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="ml-4 text-sm font-medium text-gray-900">사업자 유형</dt>
                        <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">{business_type}</dd>
                    </div>

                    {/* 견적서 작성 폼 */}
                    <form onSubmit={handleSubmit}>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-b border-gray-100">
                            <dt className="ml-4 text-sm font-medium text-gray-900">견적 비용</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                <input
                                    type="number"
                                    id="estimateMoney"
                                    value={estimateMoney}
                                    onChange={handleEstimateMoney}
                                    placeholder="견적 비용을 입력하세요"
                                    className="w-80 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </dd>
                        </div>

                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="ml-4 text-sm font-medium text-gray-900">견적 상세 내용</dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                <textarea
                                    id="estimate"
                                    value={estimate}
                                    onChange={handleEstimate}
                                    placeholder="견적 상세 내용을 입력하세요"
                                    rows="4"
                                    className="w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </dd>
                        </div>

                        <div className="text-center mt-12 mb-12">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                            >
                                견적서 제출
                            </button>
                        </div>
                    </form>
                </dl>
            </div>
        </>
    );
}