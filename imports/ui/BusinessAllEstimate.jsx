import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { CollectionRequest, CollectionEstimate } from '/imports/api/collections';

export default () => {
    const { user, estimateinReq } = useTracker(() => {
        Meteor.subscribe('CollectionEstimate');
        Meteor.subscribe('CollectionRequest');

        const user = Meteor.user();
        const businessId = user && user._id;

        const estimates = CollectionEstimate.find({ business_id: businessId }).fetch();

        const estimateinReq = estimates.map((estimate) => {
            const request = CollectionRequest.findOne({ _id: estimate.request_id });
            return { ...estimate, request };
        });
        return {
            user,
            estimateinReq,
        };
    });

    if (!estimateinReq || estimateinReq.length === 0) {
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
    
return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="mt-6 text-base font-semibold text-gray-900">{user.profile.name}님이 제출한 견적서 전체 목록</h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 align-middle"
                    >
                      요청자
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 align-middle"
                    >
                      이사 날짜
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 align-middle"
                    >
                      출발지
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 align-middle"
                    >
                      도착지
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 align-middle"
                    >
                      상세 내용
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 align-middle"
                    >
                      금액
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-40 align-middle"
                    >
                      <span className="sr-only">삭제</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {estimateinReq.length > 0 ? (
                    estimateinReq.map((estimateReq) => (
                      <tr key={estimateReq._id}>
                        {estimateReq.request && (
                          <>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                              {estimateReq.request.user_name}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                              {new Date(estimateReq.request.move_date).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                              {estimateReq.request.start_address}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                              {estimateReq.request.arrive_address}
                            </td>
                          </>
                        )}
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                          {estimateReq.details}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-middle w-40">
                          {estimateReq.amount}원
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                        onClick={() => handleDelete(estimateReq._id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        >
                        삭제
                        </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-sm text-gray-500"
                      >
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
}  