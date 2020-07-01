import React, { useEffect } from 'react';
import Lottie from 'react-lottie';
import * as networkErrorAnimationData from '@/assets/animations/network-error-screen.json';
import * as searchSatelliteAnimationData from '@/assets/animations/loading-satellite-dish.json';
import { router } from 'umi';
import { connect } from 'dva';
import { getRedirectURL } from '../User/UserLogin/utils/utils';

let interval: NodeJS.Timeout;
const networkErrorAnimationOptions = {
  loop: true,
  autoplay: true,
  animationData: networkErrorAnimationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};
const searchSatelliteAnimationOptions = {
  loop: true,
  autoplay: true,
  animationData: searchSatelliteAnimationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export default connect(
  () => ({}),
  (dispatch: (arg0: { type: string }) => Promise<boolean>) => ({ dispatch }),
)((props: { dispatch: (arg0: { type: string }) => Promise<boolean> }) => {
  const checkServer = () => {
    props
      .dispatch({
        type: 'login/checkServer',
      })
      .then((available: boolean) => {
        if (available) {
          getRedirectURL((redirect: string) => {
            router.push(redirect || '/');
          });
        }
      });
  };
  useEffect(() => {
    interval = setInterval(() => {
      checkServer();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto text-center">
          <div className="text-4xl font-bold">Oh Snap!</div>
          <div className="text-xl text-gray-600">Houston, we&apos;ve had a problem!</div>
          <div>
            <Lottie options={networkErrorAnimationOptions} width={350} />
          </div>
          <div>
            <div>
              <Lottie options={searchSatelliteAnimationOptions} width={150} />
            </div>
            <div className="text-center text-lg">Trying to establish communication...</div>
          </div>
        </div>
      </div>
    </>
  );
});
