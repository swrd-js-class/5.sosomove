import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

export default function StatusNotifications() {
  const [notifications, setNotifications] = useState([]);

  // DDP를 활용하여 데이터 구독
  const statusUpdates = useTracker(() => {
    const businessId = Meteor.userId(); // 로그인한 비즈니스 사용자 ID
    Meteor.subscribe("estimateStatusUpdates", businessId);

    return CollectionEstimate.find({}).fetch();
  });

  useEffect(() => {
    // 알림에 새로운 상태 업데이트 추가
    if (statusUpdates.length > 0) {
      const latestNotifications = statusUpdates.map((update) => ({
        id: update._id,
        status: update.status,
        requestId: update.request_id,
        updatedAt: new Date(update.updatedAt).toLocaleString(),
      }));

      setNotifications(latestNotifications);
    }
  }, [statusUpdates]);

  return (
    <div>
      <h1>상태 알림</h1>
      <ul>
        {notifications.map((note) => (
          <li key={note.id}>
            요청 ID: {note.requestId} - 상태: {note.status} ({note.updatedAt})
          </li>
        ))}
      </ul>
    </div>
  );
}
