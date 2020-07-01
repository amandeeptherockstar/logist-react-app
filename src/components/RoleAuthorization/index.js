import React from 'react';
import { getAuthority } from '@/utils/authority';

const RoleAuthorization = ({ authority, children, roleClass }) => {
  const currentAuthority = getAuthority();
  let roles;
  if (authority.includes(currentAuthority[0])) {
    roles = children;
  }
  return <div className={roleClass && roleClass}>{roles}</div>;
};

export default RoleAuthorization;
