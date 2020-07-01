import React, { useState, useEffect } from 'react';
import { Icon, Button, message, Empty, Typography, Spin } from 'antd';
import { router } from 'umi';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './style.less';
import { verifyUser } from './service';
import emailVerifyImage from '../../../assets/email-verification/email-verification.png';
import { emailVerification } from '../../../services/UserAuthentication/sendVerificationEmail';

const { Title } = Typography;
const { Text } = Typography;

export default props => {
  const [loading, setLoading] = useState(false);

  const { email, emailVerified, throughLogin } = props.location.state;

  if (emailVerified) {
    router.push('/setup/org');
  }

  let timer;

  useEffect(() => {
    timer = setInterval(() => {
      verifyUser(email).then(response => {
        if (response.emailVerified) {
          clearTimeout(timer);
          router.push('/user/login', {
            email,
          });
        }
      });
    }, 5000);
  }, []);

  return (
    <div>
      <Empty
        image={emailVerifyImage}
        imageStyle={{
          height: 150,
        }}
        description={
          <span>
            <Title level={3}>
              <FormattedMessage
                id="component.zeus.onboarding.email.verificationlinksent"
                defaultMessage="Email Verification Link Sent"
              />
            </Title>

            {email && throughLogin ? (
              <p className={styles.h3}>
                You have Registered with Zeus Earlier, But haven&apos;t Confirmed Your Email.
              </p>
            ) : (
              <Text>
                We have sent you a verification email at <strong>{email}</strong>
              </Text>
            )}
            <p>
              <Text>Please check your mailbox and follow the link inside it.</Text>
            </p>
            {/* <Button
              type="primary"
              className={styles.button}
              onClick={() => {
                router.push('/user/login');
              }}
            >
              Done
            </Button> */}

            <Spin size="large" />

            <div className="zcp-p-t-18">
              <p>Didn&apos;t Receive a Confimation Email ?</p>
            </div>
          </span>
        }
      >
        <Button
          type="link"
          className={styles.button}
          onClick={() => {
            setLoading(true);
            emailVerification(props.location.state)
              .then(() => {
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
                message.error('An Error Occurred');
              });
          }}
          loading={loading}
        >
          {loading ? (
            <React.Fragment> Sending Email....</React.Fragment>
          ) : (
            <React.Fragment>
              <Icon type="redo" /> Resend Verification Email?
            </React.Fragment>
          )}
        </Button>
      </Empty>
      ,
    </div>
  );
};
