import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from "meteor/meteor";
import { CollectionRequest, CollectionEstimate } from '/imports/api/collections';
// import BusinessMyPageNavBar from './BusinessMyPageNavBar';

export default () => {
    const { user, estimateinReq } = useTracker(() => {
        Meteor.subscribe('CollectionEstimate');
        Meteor.subscribe('CollectionRequest');

        const user = Meteor.user();
        const businessId = user && user._id;

        const estimates = CollectionEstimate.find({ business_id: businessId }).fetch();

        const estimateinReq = estimates.map((estimate) => {
            const request = CollectionRequest.findOne({ _id: estimate._id});
            return { ...estimate, request }
        })
        return {
            user,
            estimateinReq
        };
    });

    if (!estimateinReq || estimateinReq.length === 0) {
        return <p>견적서를 찾을 수 없습니다.</p>
    }

    console.log(estimateinReq.request)
    return (
        <div>
            <h2>{user.profile.name}님이 제출한 견적서 전체 목록</h2>
            <ul>
                {estimateinReq.map((estimateReq) => (
                    <li key={estimateReq._id}>
                    {estimateReq.request && (
                        <>
                        <p>사용자 이름: {estimateReq.request.user_name}</p>
                        <p>출발지: {estimateReq.request.start_address}</p>
                        <p>도착지: {estimateReq.request.arrive_address}</p>
                        </>
                    )}
                        <p>상세 내용: {estimateReq.details}</p>
                        <p>금액: {estimateReq.amount}원</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};