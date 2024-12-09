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
        <div className="px-6 py-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            견적서 작성 페이지
          </h2>
          <div className="mb-6">
            <p className="text-sm text-gray-700">
              <strong>요청자 이름:</strong> {currentRequest.user_name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>사업체명:</strong> {currentUser?.profile?.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>사업자 유형:</strong> {business_type}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="estimateMoney"
                className="block text-sm font-medium text-gray-700"
              >
                견적 비용
              </label>
              <input
                type="number"
                id="estimateMoney"
                value={estimateMoney}
                onChange={handleEstimateMoney}
                placeholder="견적 비용 작성"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="estimate"
                className="block text-sm font-medium text-gray-700"
              >
                견적 상세 내용
              </label>
              <input
                type="text"
                id="estimate"
                value={estimate}
                onChange={handleEstimate}
                placeholder="견적 상세 내용 작성"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                제출
              </button>
            </div>
          </form>
        </div>
      );
    }