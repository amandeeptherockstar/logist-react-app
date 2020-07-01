import React from 'react';
import { Icon, Row, Col } from 'antd';
import styles from './ZeusRules.less';

export default function index() {
  return (
    <div className={styles.sideBody}>
      {/* <div className={styles.lang}>
              <SelectLang />
            </div> */}
      <div className={styles.sideTitle}>
        <h2>Fidelissd Team Priorities</h2>
      </div>
      <div className={styles.sideRules}>
        <Row>
          <Col span={2}>
            <Icon type="safety-certificate" theme="twoTone" />
          </Col>
          <Col span={22}>
            Take care of the company, and the company will take care of you. Our collective
            decisions will always be based upon what is best for the team, and not any one
            individual within.
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <Icon type="safety-certificate" theme="twoTone" />
          </Col>
          <Col span={22}>
            {`Our company purpose is bigger than us, our drive is for reason's greater than us, and we
            are working to make things better in everything we touch.`}
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <Icon type="safety-certificate" theme="twoTone" />
          </Col>
          <Col span={22}>
            Regardless of our company size and pace of the business, our supplier customers are the
            life blood of the company. Our business will always be to make their lives easier by
            working with us at all angles.
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <Icon type="safety-certificate" theme="twoTone" />
          </Col>
          <Col span={22}>
            Internal team transparency and collaborative communication will be a standard on all
            functions of our business. We can only operate as a team if we have total project
            transparency, as a team in clear understanding.
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <Icon type="safety-certificate" theme="twoTone" />
          </Col>
          <Col span={22}>
            Our company wide collective forward strategy and vision will always be a priority in
            what we do today, in order to support our future tomorrow(s).
          </Col>
        </Row>
      </div>
      <div className={styles.sideImage} />
    </div>
  );
}
