//사업자 알림기능

import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Notifications } from '/imports/api/collections';

export const NotificationList = ({ businessId }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  const notifications = useTracker(() => {
    const handle = Meteor.subscribe("notifications", businessId);
    if (handle.ready()) {
      return Notifications.find({}, { sort: { createdAt: -1 }, limit: 1 }).fetch();
    }
    return [];
  }, [businessId]);

  useEffect(() => {
    if (notifications.length > 0) {
      const newNotification = notifications[0];
      if (!latestNotification || newNotification._id !== latestNotification._id) {
        setLatestNotification(newNotification);
        setShowAlert(true);
      }
    }
  }, [notifications, latestNotification]);

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {showAlert && latestNotification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg shadow-lg text-xl flex items-center justify-between z-50">
          <span>{latestNotification.message}</span>
          <button
            onClick={closeAlert}
            className="ml-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition">
            닫기
          </button>
        </div>
      )}
    </div>
  );
};
