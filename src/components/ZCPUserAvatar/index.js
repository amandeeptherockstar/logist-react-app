import React, { useState, useEffect } from 'react';
import { Avatar, Tooltip, Skeleton } from 'antd';
import { connect } from 'dva';

const companyUserColor = '#1b4fe8';

const ZCPUserAvatar = props => {
  const { currentUser, currentUserLoading } = props;

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setAvatar(currentUser.avatar);
    return () => {};
  }, [currentUser]);
  return (
    currentUser.firstName && (
      <Tooltip title={`${currentUser.firstName} ${currentUser.lastName}`}>
        <Skeleton active loading={currentUserLoading}>
          <Avatar
            style={{ backgroundColor: companyUserColor, marginRight: '10px' }}
            className="userAvatar"
            src={avatar || undefined}
          >
            {avatar ? null : currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)}
          </Avatar>
        </Skeleton>
      </Tooltip>
    )
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
}))(ZCPUserAvatar);
