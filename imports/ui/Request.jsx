import React, { useState } from "react";
import { useTracker } from 'meteor/react-meteor-data';

export default () => {

  const PageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  // 데이터 구독 및 상태 업데이트
  const { items, ready } = useTracker(() => {
    const skip = (currentPage - 1) * PageSize;
    const limit = PageSize;
    Meteor.subscribe('users', skip, limit);
    return {
      items: Meteor.users.find({}, { skip, limit }).fetch(),
      ready: true
    };
  }, [currentPage]);
  const totalCount = Meteor.users.find().count();
  if (!ready) {
    return <div>Loading...</div>;
  }
  const totalPages = Math.ceil(totalCount / PageSize);

  return (
    <div>
      <h1>페이징처리 테스트</h1>
      <ul>
        {items.map((item) =>
          <li key={item._id}>
            {item.username}
          </li>
        )}
      </ul>
      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>이전</button>
        <span>{` page ${currentPage} of ${totalPages} `}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>다음</button>
      </div>
    </div>
  );
};