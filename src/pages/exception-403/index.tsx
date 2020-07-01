import { Row, Col } from 'antd';
import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from '@/assets/animations/notfound.json';
import { formatMessage } from 'umi-plugin-locale';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export default () => (
  <>
    <Row type="flex" align="middle" justify="center">
      <Col style={{ textAlign: 'center' }} span={24}>
        <h1 style={{ marginTop: 100, fontSize: '3rem' }}>
          {formatMessage({
            id: 'exception-403.description.403',
            defaultMessage: "We're sorry, you don't have access to this page.",
          })}
        </h1>{' '}
      </Col>
      <Col span={24}>
        <div style={{ marginTop: -300 }}>
          <Lottie options={defaultOptions} width={500} />
        </div>
      </Col>
    </Row>
  </>
  // <Result
  //   status="403"
  //   title="403"
  //   style={{
  //     background: 'none',
  //   }}
  //   icon={}
  //   subTitle={}
  //   extra={
  //     <Link to="/">
  //       <Button type="primary">
  //         {formatMessage({ id: 'exception-403.exception.back', defaultMessage: 'Back Home' })}
  //       </Button>
  //     </Link>
  //   }
  // />
);
