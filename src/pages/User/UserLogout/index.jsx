import React, { useEffect } from 'react';

const UserLogout = () => {
  useEffect(() => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
    window.location.reload();
    return () => {};
  }, []);
  return <div>Logging you out...</div>;
};

export default UserLogout;
