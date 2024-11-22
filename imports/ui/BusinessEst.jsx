import React, { useEffect, useRef, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest, ColletionEstCar } from '/imports/api/collections';
import { Link, useParms } from 'react-router-dom';

export default() => {
    const { id } = useParms();
    const [estimate, setEstimate] = useState('');
    const [businessType, setBusinessType] = useState('');

    const { estRequset, currentUser } = useTracker(() => {
        Meteor.subcribe('CollectionRequest');
        const allData = CollectionRequest.findOne({ _id: id});
        const user = Meteor.user()
        return { estRequset: allData, currentUser: user }
    });

    useEffect(() => {
        if (currentUser && currentUser.profile) {
            setBusinessType(currentUser.profile.type() || null);
        }
    }, [currentUser]);

    if (!estRequset) {
        return <p>요청을 찾을 수 없습니다.</p>
    }

    if (!currentUser) {
        alert('로그인이 필요합니다')
        return;
    }

    const handleEstimate = (e) => {
        setEstimate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    
    const business_id = currentUser._id;
    const business_name = currentUser.profile.company.company_name || '사업자명 없음';
    const business_contect = currentUser.profile.phone || '연락처 없음';

    const estimateData = {
        request_id: id,
        business_id,
        business_name,
        business_contect,
        details: estimate,
        amount: 100000,
        businessType: businessType
    }

    return (
    <div>
        <h2>견적서 작성 페이지</h2>
        <p>요청 id : {estRequset._id}</p>
        <p>요청자 이름: {estRequset.user_name}</p>
        <p>사업자 유형: {businessType}</p>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="estimate">견적 상세 내용:</label>
                <textarea
                id = "estimate"
                value={estimate}
                onChange={handleEstimate}
                placeholder='견적 상세 내용 작성'
                />
            </div>
            <div>
            <button type="submit">제출</button>
            </div>
        </form>
    </div>
    );
};