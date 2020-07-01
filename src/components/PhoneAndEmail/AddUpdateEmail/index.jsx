import React, { useState } from 'react';
import { Input, Modal, Form, Button, Row, Col, message, Checkbox } from 'antd';
import { connect } from 'dva';

const AddUpdateEmail = props => {
  const {
    setEditEmail,
    title,
    isOpen,
    form,
    fetchData,
    email,
    setAddEmail,
    workType,
    getEmail,
  } = props;
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);
  const [checkBox, setCheckBox] = useState(true);

  const handleAddSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const reqData = {
          email: values.email && values.email.toLowerCase(),
          is_primary_email: '',
        };
        setLoading(true);
        await props.dispatch({
          type: 'partyPoc/addPartyEmail',
          payload: {
            reqData,
            partyId: props.partyId,
            callback: res => {
              if (res.responseMessage) {
                message.success('Email Address added successfully!');
                const addEmail = {
                  contactMechId: res.emailDetails.contactMechId,
                  email: res.emailDetails.emailAddress,
                };
                fetchData(addEmail, props.partyId);
                setAddEmail(false);
                setLoading(false);
                if (checkBox === true) {
                  props.dispatch({
                    type: 'partyPoc/makeEmailPrimary',
                    payload: {
                      partyId: props.partyId,
                      mechId: res.emailDetails.contactMechId,
                      cb: resp => {
                        if (resp) {
                          getEmail();
                        }
                      },
                    },
                  });
                }
              }
            },
          },
        });
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const reqData = {
          email: values.email && values.email.toLowerCase(),
        };
        setLoading(true);
        await props.dispatch({
          type: 'partyPoc/updatePartyEmail',
          payload: {
            reqData,
            partyId: props.partyId,
            emailId: props.emailId,
            callback: res => {
              if (res.responseMessage) {
                message.success('Email Address updated successfully!');
                const updatedEmail = {
                  contactMechId: res.emailDetails.contactMechId,
                  email: res.emailDetails.emailAddress,
                };
                fetchData(updatedEmail, props.emailId);
                setEditEmail(false);
                setLoading(false);
              }
            },
          },
        });
      }
    });
  };
  return (
    <Modal
      width="640px"
      title={title}
      visible={isOpen}
      destroyOnClose
      maskClosable={false}
      footer={
        <Row type="flex" justify="space-between">
          <Col>
            {workType === 'Add' ? (
              <Checkbox
                id={`${workType}-email-address-modal-make-primary`}
                checked={checkBox}
                onChange={e => {
                  setCheckBox(e.target.checked);
                }}
              >
                Make Primary
              </Checkbox>
            ) : null}
          </Col>
          <Col>
            {workType === 'Update' ? (
              <Button id="Update-Email" loading={loading} type="primary" onClick={handleSubmit}>
                Update Email
              </Button>
            ) : (
              <Button id="Add-Email" loading={loading} type="primary" onClick={handleAddSubmit}>
                Add Email
              </Button>
            )}
          </Col>
        </Row>
      }
      onCancel={() => {
        if (workType === 'Update') {
          setEditEmail(false);
        } else {
          setAddEmail(false);
        }
      }}
    >
      <Form>
        <Row gutter={24}>
          <Col span={24}>
            <div className="zcp-ant-form-label-w-full">
              <Form.Item colon={false} hasFeedback label={<span>Email</span>}>
                {getFieldDecorator('email', {
                  initialValue: email,
                  rules: [
                    {
                      required: true,
                      message: 'Enter Email Address',
                    },
                    {
                      message: 'Enter Valid Email Address',
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    },
                    {
                      validator(rule, value) {
                        let val;
                        if (props.employee) {
                          val =
                            props.existingEmails &&
                            props.existingEmails.map(em => em.email === value)[0];
                        } else {
                          val =
                            props.existingEmails &&
                            props.existingEmails.map(em => em.email_address === value)[0];
                        }

                        if (!val) {
                          return Promise.resolve();
                        }
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject('Email address already exists');
                      },
                    },
                  ],
                })(
                  <Input
                    autoFocus
                    id="Email-Address-Input-Field"
                    type="email"
                    placeholder="info@mycompany.com"
                    onBlur={e => {
                      e.target.value = e.target.value.toLowerCase();
                      e.target.value = e.target.value ? e.target.value.trim() : '';
                    }}
                    maxLength={50}
                    size="large"
                  />,
                )}
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create()(connect(dispatch => ({ dispatch }))(AddUpdateEmail));
