import React, { useState } from 'react';
import Authorized from '@/pages/Authorized';
import AuthCounterContext from './AuthCounterContext';

const AuthCounter = props => {
  const [authCounter, setAuthCounter] = useState(1800);

  return (
    <AuthCounterContext.Provider value={{ authCounter, setAuthCounter }}>
      <Authorized {...props}>{props.children}</Authorized>
    </AuthCounterContext.Provider>
  );
};

export default AuthCounter;
