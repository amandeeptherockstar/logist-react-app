import React, { useEffect } from 'react';
import { connect } from 'dva';
import logoAnimatedGif from '@/assets/logo/zeus-logo.gif';
import { router } from 'umi';

const StripePaymentLoading = ({ dispatch, location }) => {
  useEffect(() => {
    if (location.query) {
      dispatch({
        type: 'userAccountSetting/sendStripeAuthorizedData',
        payload: {
          data: {
            ...location.query,
          },
          callback: () => router.push('/account/settings/integrations/stripe'),
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

export default connect(null)(StripePaymentLoading);
