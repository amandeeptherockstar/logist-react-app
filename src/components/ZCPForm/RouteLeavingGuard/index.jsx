import React, { useState, useEffect } from 'react';
import Prompt from 'umi/prompt';
import ConfirmLeaveModal from '../ConfirmLeaveModal';

const RouteLeavingGuard = ({ shouldBlockNavigation, navigate, when }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  useEffect(() => {
    if (confirmedNavigation) {
      navigate(lastLocation.pathname);
    }
  }, [confirmedNavigation]);

  const showModal = location => {
    setModalVisible(true);
    setLastLocation(location);
  };

  const closeModal = callback => {
    setModalVisible(false);
    if (callback) {
      callback();
    }
  };

  const handleBlockedNavigation = nextLocation => {
    if (!confirmedNavigation && shouldBlockNavigation()) {
      showModal(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () =>
    closeModal(() => {
      if (lastLocation) {
        setConfirmedNavigation(true);
      }
    });

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <ConfirmLeaveModal
        visible={modalVisible}
        onCancel={() => closeModal(null)}
        onConfirm={handleConfirmNavigationClick}
      />
    </>
  );
};

export default RouteLeavingGuard;
