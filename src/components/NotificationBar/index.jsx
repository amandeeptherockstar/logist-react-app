import React from 'react';

const NotificationBar = ({ description }) => (
  <div id="freeTrialBar" className="zcp-global-notification-bar bg-blue-900 py-1">
    <div className="text-center">{description}</div>
  </div>
);

export default NotificationBar;
