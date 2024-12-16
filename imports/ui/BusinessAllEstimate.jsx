import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest, CollectionEstimate } from '/imports/api/collections';

export default () => {
  const [statusFilter, setStatusFilter] = useState(0); // 상태 필터 (0: 전체, 1: 대기중, 2: 매칭, 3: 매칭 취소)
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  const { user, estimateinReq } = useTracker(() => {
    const estimateSub = Meteor.subscribe('CollectionEstimate');
    const requestSub = Meteor.subscribe('CollectionRequest');

    if (!estimateSub.ready() || !requestSub.ready()) {
      return { user: null, estimateinReq: [] };
    }

    const user = Meteor.user();
    const businessId = user._id;
    const estimates = CollectionEstimate.find({ business_id: businessId }).fetch();

    const estimateinReq = estimates.map((estimate) => ({
      ...estimate,
      request: CollectionRequest.findOne({ _id: estimate.request_id }),
    }));

    // 날짜 오름차순 정렬
    estimateinReq.sort((a, b) => {
      const dateA = new Date(a.request?.move_date || 0);
      const dateB = new Date(b.request?.move_date || 0);
      return dateA - dateB;
    });

    // 데이터가 준비되었으므로 로딩 상태를 false로 설정
    setIsLoading(false);

    return { user, estimateinReq };
  }, []);

  // 상태 필터 적용
  const filteredEstimates = estimateinReq.filter(
    (estimate) => statusFilter === 0 || estimate.status === statusFilter
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading ...</p>
      </div>
    );
  }

  if (!estimateinReq.length) {
    return <p className="text-gray-500">견적서를 찾을 수 없습니다.</p>;
  }

  const handleDelete = (estimateId) => {
    Meteor.call('estimate.delete', estimateId, (err) => {
      if (err) {
        alert('삭제 중 오류가 발생했습니다: ' + err.reason);
      } else {
        alert('견적서가 삭제되었습니다.');
      }
    });
  };

  // 상태 텍스트 반환
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return '대기중';
      case 2:
        return '매칭';
      case 3:
        return '매칭 취소';
      default:
        return '알 수 없음';
    }
  };

  // 상태 스타일 반환
  const getStatusStyle = (status) => {
    switch (status) {
      case 1:
        return { text: 'text-gray-900', bg: 'bg-gray-200' };
      case 2:
        return { text: 'text-green-900', bg: 'bg-green-200' };
      case 3:
        return { text: 'text-red-900', bg: 'bg-red-200' };
      default:
        return { text: 'text-gray-900', bg: 'bg-gray-200' };
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="mt-6 text-base font-semibold text-gray-900">
            {user.profile.name}님이 제출한 견적서 전체 목록
          </h1>
        </div>
        {/* 상태 필터 */}
        <div className="sm:ml-4 mt-4 sm:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(Number(e.target.value))}
            className="mt-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={0}>전체</option>
            <option value={1}>대기중</option>
            <option value={2}>매칭</option>
            <option value={3}>매칭 취소</option>
          </select>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">요청자</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">이사 날짜</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">출발지</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">도착지</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">상세 내용</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">금액</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">상태</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">삭제</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredEstimates.length > 0 ? (
                    filteredEstimates.map((estimateReq) => (
                      <tr key={estimateReq._id}>
                        {estimateReq.request && (
                          <>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                              {estimateReq.request.user_name || 'N/A'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {estimateReq.request.move_date
                                ? new Date(estimateReq.request.move_date).toLocaleDateString()
                                : 'N/A'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {estimateReq.request.start_address || 'N/A'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {estimateReq.request.arrive_address || 'N/A'}
                            </td>
                          </>
                        )}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {estimateReq.details || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {estimateReq.amount ? `${estimateReq.amount}원` : 'N/A'}
                        </td>
                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                          <span className="relative inline-block px-3 py-1 font-semibold leading-tight">
                            <span
                              aria-hidden="true"
                              className={`absolute inset-0 ${getStatusStyle(estimateReq.status).bg} rounded-full opacity-50`}
                            ></span>
                            <span className={`relative ${getStatusStyle(estimateReq.status).text}`}>
                              {getStatusText(estimateReq.status)}
                            </span>
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {estimateReq.status == 1 && (
                            <button
                              onClick={() => handleDelete(estimateReq._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              삭제
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-sm text-gray-500">
                        요청서가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
