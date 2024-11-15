import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CollectionRequest, Collectionestimate } from '/imports/api/collections';
import { Meteor } from 'meteor/meteor';

export default () => {
    const { requestList, businessType } = useTracker(() => {
        const user = Meteor.user();
        const businessType = user && user.profile ? user.profile.type : null;

        const allRequests = CollectionRequest.find({}).fetch();

        const filterRequest = allRequests.filter(request => {
            if (businessType == "용달") {
                return request.profiletype == "일반" || request.profiletype == "용달";
            } else if (businessType == "헬퍼") {
                return request.profiletype == "일반" || request.profiletype == "헬퍼";
            }
        });
        
        return{
            requestList: filterRequest,
            businessType
          };
    })

    return(
        <div>
            <h2>요청서 목록</h2>
            <ul>
                {requestList.map((request) => (
                    <li key={request._id}>
                        {request.}
                    </li>
                ))}
            </ul>
        </div>
    );
}