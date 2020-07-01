/**
 * Email verification screen, validates if the email is verified or not, takes the user to
 * login page upon successful authentication
 */

import React, { useState, useEffect } from 'react';
import { Icon, Empty, Typography, Alert } from 'antd';
import { router } from 'umi';
import styles from './style.less';
import heroCelebrateAudioUrl from '../../../assets/sounds/wav/hero-sounds/hero_simple-celebration-01.wav';
import emailVerified from '../../../assets/img/email-verified.svg';
import { verifyEmailToken } from '../../../services/UserAuthentication/verifyEmailToken';

const { Title } = Typography;
const { Text } = Typography;

const message = () => <Text>Hello world</Text>;

const heroCelebrateAudio = new Audio(heroCelebrateAudioUrl);

const UserVerified = props => {
  const {
    // children,
    location = {
      pathname: '',
      search: '',
    },
  } = props;
  const token = location.search && location.search.split('=')[1];
  const [tokenVerified, setTokenVerified] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    heroCelebrateAudio.play();
    verifyEmailToken(token)
      .then(response => {
        if (response.status === 'ok') {
          setTimeout(() => {
            router.push('/user/login');
          }, 3000);
          setTokenVerified(true);
        } else {
          setTokenVerified(false);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.email}>
      <Empty
        image={emailVerified}
        imageStyle={{
          height: 150,
        }}
        description={
          <span>
            {tokenVerified ? (
              <div className={styles.text}> Your Email Has Been Verified Successfully !</div>
            ) : (
              <div>
                <p>
                  <Title level={4}>
                    {' '}
                    Verifying email... <Icon type="sync" spin />{' '}
                  </Title>
                </p>
                <p>
                  <message />
                </p>
                <Text>Your email is being verified, please Wait ..... </Text>
              </div>
            )}
          </span>
        }
      >
        <div style={{ textAlign: 'left' }}>
          {tokenVerified && (
            <Alert message="Email verified successfully!" type="success" showIcon />
          )}
        </div>
      </Empty>
    </div>
  );
};

export default UserVerified;
