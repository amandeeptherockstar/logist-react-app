import React, { useEffect, useState } from 'react';
import dogSvg from '@/assets/img/empty-states/dog.svg';
import alertUserAudioUrl from '@/assets/sounds/wav/secondary-system-sounds/ui_loading.wav';
import { Button, Icon } from 'antd';
import timers from '@/timers';

const alertUserAudio = new Audio(alertUserAudioUrl);
const playSoundOnRepeatUtil = (target, RepeatCount) => {
  const fnSoundRepeat = () => {
    // eslint-disable-next-line no-param-reassign
    RepeatCount -= 1;
    // eslint-disable-next-line no-param-reassign
    target.currentTime = 0;

    if (RepeatCount > 0) {
      target.play();
    } else {
      target.removeEventListener('ended', fnSoundRepeat);
    }
  };

  target.addEventListener('ended', fnSoundRepeat);
  target.play();
};

const SessionTimeoutNotification = props => {
  const [secondsToAutoLogout, setSecondsToAutoLogout] = useState(
    parseInt(localStorage.getItem('timer'), 10),
  );
  useEffect(() => {
    playSoundOnRepeatUtil(alertUserAudio, 2); // play the alert sound twice to the user.
    return () => {};
  }, []);

  useEffect(() => {
    timers.secondsToTimeoutTimer = setInterval(() => {
      setSecondsToAutoLogout(parseInt(localStorage.getItem('timer'), 10));
    });
    return () => {
      clearInterval(timers.secondsToTimeoutTimer);
    };
  }, []);

  return (
    <div className="text-center p-10">
      <p className="text-xl font-bold">Woof Woof!!</p>
      <p className="text-lg">Are you still there?</p>
      <img src={dogSvg} alt="Anybody there?" style={{ height: '150px' }} />
      <div className="pt-2">
        <p className="text-base mb-4">
          Your session is about to expire, click below to stay logged in!
        </p>
        <Button type="primary" onClick={props.onRefreshSessionClick}>
          Yes I&apos;m here <Icon type="arrow-right" />
        </Button>
        <p className="text-lg pt-4">
          {"You'll"} be logged out in <strong>{secondsToAutoLogout}</strong> second(s).
        </p>
      </div>
    </div>
  );
};

export default SessionTimeoutNotification;
