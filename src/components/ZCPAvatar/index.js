/* eslint-disable no-nested-ternary */
import React from 'react';
import { Avatar, Tooltip } from 'antd';

const companyUserColor = '#1b4fe8';

const ZCPAvatar = ({ avatar, displayName }) => (
  <Tooltip title={`${displayName}`}>
    <Avatar
      style={{ backgroundColor: companyUserColor, marginRight: '10px' }}
      className="userAvatar"
      src={avatar || undefined}
      alt={displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .substring(0, 2)}
    >
      {avatar
        ? null
        : displayName
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .substring(0, 2)}
    </Avatar>
  </Tooltip>
);

export default ZCPAvatar;
