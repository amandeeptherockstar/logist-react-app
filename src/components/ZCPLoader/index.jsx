import React from 'react';
import { Spin, Icon } from 'antd';

const ZCPLoader = ({ loading, children }) => (
  <Spin spinning={loading} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
    {children}
  </Spin>
);

export default ZCPLoader;
