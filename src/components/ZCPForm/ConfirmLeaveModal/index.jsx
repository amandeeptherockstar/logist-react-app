import React from 'react';
import { Modal, Button } from 'antd';

const ConfirmLeaveModal = ({ visible, onCancel, onConfirm }) => (
  <Modal
    className="zcp-flat-modal"
    zIndex={5000}
    title={null}
    visible={visible}
    bodyStyle={{ zIndex: 2000000 }}
    onCancel={onCancel}
    centered
    destroyOnClose
    footer={null}
    maskClosable={false}
  >
    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg
              className="h-6 w-6 text-red-600"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Close without saving?</h3>
            <div className="mt-2">
              <p className="text-sm leading-5 text-gray-500">
                You have unsaved changes. You&apos;ll lose your changes if you don&apos;t save
                first.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 p-4 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
        <span className="flex items-center w-full sm:ml-3 sm:w-auto">
          <Button id="confirm-btn" key="submit" type="danger" onClick={onConfirm}>
            Close without saving
          </Button>
        </span>
        <span className="flex items-center w-full sm:mt-0 sm:w-auto">
          <Button id="cancel-btn" key="back" onClick={onCancel}>
            Continue editing
          </Button>
        </span>
      </div>
    </div>
  </Modal>
);

export default ConfirmLeaveModal;
