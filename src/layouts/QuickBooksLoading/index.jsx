import React, { useEffect } from 'react';
import { connect } from 'dva';
import logoAnimatedGif from '@/assets/logo/zeus-logo.gif';
import { router } from 'umi';

const QuickBooksLoading = ({ dispatch, location }) => {
  useEffect(() => {
    if (location.query) {
      dispatch({
        type: 'userAccountSetting/sendQuickBooksAuthorizedData',
        payload: {
          data: {
            ...location.query,
          },
          callback: res => {
            if (res.realm_id) {
              router.push('/account/settings/integrations/quickbooks');
            } else {
              router.push('/');
            }
          },
        },
      });
    }
  }, []);

  return (
    <div className="flex justify-center content-center h-full">
      <div className="m-auto">
        <div className="text-center">
          <img src={logoAnimatedGif} alt="Zeus Logo Loading" className="w-48" />
        </div>
        <div className="font-medium text-base zcp-loading pl-10">Working on it</div>
      </div>
    </div>
  );
};

export default connect(null)(QuickBooksLoading);
