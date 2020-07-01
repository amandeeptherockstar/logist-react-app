import React, { useState } from 'react';
import { getUserInfo } from '../services/OrgSetup/getUserInfo';

export default () => {
  const [FirstName, setFirstName] = useState(null);

  getUserInfo()
    .then(resp => {
      // setFirstName(resp.first_name);
      setFirstName(resp.personal_details.first_name);
    })
    .catch(() => {});

  return (
    <div>
      <p>Welcome {FirstName}</p>
    </div>
  );
};
