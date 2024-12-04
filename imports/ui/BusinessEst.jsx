import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest } from '/imports/api/collections';
import { useParams, useNavigate } from 'react-router-dom';

export default() => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [estimateMoney, setEstimateMoney] = useState('');
    const [estimate, setEstimate] = useState('');

    const { estRequest, currentUser, business_type } = useTracker(() => {
        Meteor.subscribe('CollectionRequest');
        const allData = CollectionRequest.find({}).fetch();
        const user = Meteor.user()
        const business_type = user.profile.type || null;

        return { estRequest: allData, currentUser: user, business_type }
    },[]);

    const currentRequest = estRequest.find(request => request._id === id);

    const handleEstimate = (e) => {
        setEstimate(e.target.value)
    };

    const handleEstimateMoney = (e) => {
        setEstimateMoney(e.target.value)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
    if (!estimateMoney || estimateMoney <= 0) {
        alert('유효한 견적 비용을 입력해주세요');
        return;
    }

    if (!estimate.trim()) {
        alert('견적 상세 내용을 입력해주세요');
        return;
    }

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
    
        Meteor.call('estimate.insert', estimateData, estimateMoney, (err,res) => {
            if (err) {
                alert('견적서 저장 중 오류가 발생했습니다')
            } else {
                CollectionRequest.update(
                    { _id: id },
                    { $set: { estimate: estimateData, submitted: true, status: 1}},
                    (err) => {
                        if(err) {
                            console.log('요청 상태 변경 중 오류 발생:', err)
                        } else {
                            alert('견적서가 제출되었습니다');
                            setEstimate('');
                            setEstimateMoney('');

                            navigate('/business/allrequest');
                        }
                    }
                );
            }
        });
    };
    
    return (
    <div>
        <h2>견적서 작성 페이지</h2>
        <p>요청자 이름: {currentRequest.user_name}</p>
        <p>사업체명: {currentUser.profile.name}</p>
        <p>사업자 유형: {business_type}</p>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="estimateMoney">견적 비용:</label>
                <input
                type="number"
                id = "estimateMoney"
                value={estimateMoney}
                onChange={handleEstimateMoney}
                placeholder='견적 비용 작성'
                />
            </div>
            <div>
                <label htmlFor="estimate">견적 상세 내용:</label>
                <input
                type="text"
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