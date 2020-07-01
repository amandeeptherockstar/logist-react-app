import React from 'react';
import { Spin, Icon } from 'antd'; // loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport

const spinner = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const PageLoading = () => (
  <div
    style={{
      paddingTop: 100,
      textAlign: 'center',
    }}
  >
    <Spin tip="Loading..." indicator={spinner} size="large" />
  </div>
);

export default PageLoading;
