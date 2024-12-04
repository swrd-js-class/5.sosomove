import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

export default() => {
        const [matchingRequests, setMatchingRequests] = useState([]);
        const navigate = useNavigate();

        const { businessType } = useTracker(() => {        
            const user = Meteor.user();
            const businessType = user.profile.type || null;
        
            return { businessType };
          });

        useEffect(() =>{
            const businessId = Meteor.userId();
            Meteor.call('business.Matching', businessId, (err, res) => {
                if (err) {
                    console.error('매칭 요청을 불러오는 데 실패했습니다:', err);
                } else {
                    setMatchingRequests(res);
                }
            });
        }, []);

    return (
        <div>
            <h2>매칭 내역</h2>
            <ul>
                {matchingRequests.length > 0 ? (
                    matchingRequests.map((matchingRequest) => (
                        <li key={matchingRequest._id}>
                            <div>
                                <p>요청자 {matchingRequest.user_name}</p>
                                <p>상태 {matchingRequest.status === 1 ? "견적서 제출" : matchingRequest.status === 2 ? "매칭 성공" : "매칭 취소"}</p>
                            </div>
                            <button onClick={() => navigate(`/business/request/${matchingRequest._id}`)}>자세히 보기</button>
                        </li>
                    ))
                ) : (<p>매칭 내역이 없습니다.</p>)}
            </ul>
        </div>
    );
}