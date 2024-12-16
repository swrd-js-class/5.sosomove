import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { CollectionRequest, CollectionEstimate } from '/imports/api/collections';
import { Link } from 'react-router-dom';
import { area } from "./BusinessArea.jsx"

export default () => {
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedSubArea, setSelectedSubArea] = useState("");
    const { user, businessType, requests } = useTracker(() => {
        Meteor.subscribe('Users');
        Meteor.subscribe('CollectionRequest');
        Meteor.subscribe('CollectionEstimate');
        const user = Meteor.user();
        const businessType = user.profile.type || null;
        const businessId = user._id;
        const submitRequestIds = CollectionEstimate.find({ business_id: businessId }).map(estimate => estimate.request_id);
        const allRequests = CollectionRequest.find({ _id: { $nin: submitRequestIds } }).fetch();
        return {
            user,
            businessType,
            requests: allRequests,
        };
    }, []);

    const subAreas = area.find((area) => area.name === selectedArea)?.subArea || [];

    const filteredRequests = requests.filter((request) => {
        if (!selectedArea && !selectedSubArea) return true;
        const startInArea = request.start_address.includes(selectedArea) && request.start_address.includes(selectedSubArea);
        const arriveInArea = request.arrive_address.includes(selectedArea) && request.arrive_address.includes(selectedSubArea);
        return startInArea || arriveInArea;
    }).filter((request) => {
        if (businessType === "헬퍼") {
            return request.reqHelper.request_time_area !== "" || request.reqHelper.h_type === true;
        }
        return true;
    })
        .sort((a, b) => new Date(a.move_date) - new Date(b.move_date));

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="mt-6 text-base font-semibold text-gray-900">견적요청서 목록</h1>
                </div>
                <div className="mt-4 px-4 flex gap-4">
                    <select
                        value={selectedArea}
                        onChange={(e) => {
                            setSelectedArea(e.target.value);
                            setSelectedSubArea("");
                        }}
                        className="mt-4 text-left w-2/5 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-46 sm:text-sm"
                    >
                        <option value="">지역</option>
                        {area.map((area) => (
                            <option key={area.name} value={area.name}>
                                {area.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedSubArea}
                        onChange={(e) => setSelectedSubArea(e.target.value)}
                        className="text-left mt-4 w-2/5 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-46 sm:text-sm"
                    >
                        <option value="">시/군/구</option>
                        {subAreas.map((subArea) => (
                            <option key={subArea} value={subArea}>
                                {subArea}
                            </option>
                        ))}
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
                                        <th scope="col" className="py-2 sm:py-3.5 pl-2 sm:pl-4 pr-2 sm:pr-3 text-left text-xs sm:text-sm font-semibold text-gray-900">요청인</th>
                                        <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">이사 날짜</th>
                                        <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">출발지</th>
                                        <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">도착지</th>
                                        <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">출발 평수</th>
                                        {businessType === "용달" && (
                                            <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">인부 추가</th>
                                        )}
                                        {businessType === "헬퍼" && (
                                            <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">요청 시간대 / 요청 사항</th>
                                        )}
                                        <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">
                                            비고
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map((request) => (
                                            <tr key={request._id}>
                                                <td className="whitespace-nowrap py-2 sm:py-4 pl-2 sm:pl-4 pr-2 sm:pr-3 text-xs sm:text-sm text-gray-900">
                                                    {request.user_name}
                                                </td>
                                                <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                                                    {new Date(request.move_date).toLocaleDateString()}
                                                </td>
                                                <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                                                    {request.start_address}
                                                </td>
                                                <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                                                    {request.arrive_address}
                                                </td>
                                                <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                                                    {request.house_size}평
                                                </td>
                                                {businessType === "용달" && (
                                                    <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                                                        {request.addworker ? "1명 추가" : "없음"}
                                                    </td>
                                                )}
                                                {businessType === "헬퍼" && (
                                                    <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                                                        {request.reqHelper.request_time_area} / {request.reqHelper.h_type}
                                                    </td>
                                                )}
                                                <td className="whitespace-nowrap px-2 sm:px-3 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                                                    <Link
                                                        to={`/business/request-details/${request._id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 hover:underline"
                                                    >
                                                        상세 보기
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="100%" className="text-center py-4 text-xs sm:text-sm text-gray-500">
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
