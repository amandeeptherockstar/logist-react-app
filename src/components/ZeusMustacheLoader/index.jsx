import React from 'react';
import logoAnimatedGif from '@/assets/logo/zeus-logo.gif';

const ZeusMustacheLoader = () => (
  <div className="flex justify-center content-center h-full">
    <div className="m-auto">
      <div className="text-center">
        <img src={logoAnimatedGif} alt="Zeus Logo Loading" className="w-48" />
      </div>
      <div className="font-medium text-base zcp-loading pl-10">Working on it</div>
    </div>
  </div>
);

export default ZeusMustacheLoader;
