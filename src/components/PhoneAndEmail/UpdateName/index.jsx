import React from 'react';
import { Input, Modal, Form, Button, Row, Col, message } from 'antd';
import { connect } from 'dva';

const UpdateName = props => {
  const { setEditName, title, isOpen, form, name, setData, type } = props;
  const { getFieldDecorator } = form;
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const reqData = {
          name: values.name,
        };
        const key = 'update';
        message.loading({ content: `Updating ${type} name...`, key });
        props.dispatch({
          type: 'partyPoc/updatePartyName',
          payload: {
            reqData,
            partyId: props.partyId,
            callback: res => {
              if (res.responseMessage) {
                setData(values.name);
                message.success({ content: `${type} name updated successfully!`, key });
              }
              setEditName(false);
            },
          },
        });
      }
    });
  };

  return (
    <Modal
      width="500px"
      title={title}
      visible={isOpen}
      destroyOnClose
      maskClosable={false}
      footer={
        <>
          <Button
            id="Update-Name-Button"
            type="primary"
            onClick={handleSubmit}
            loading={props.loading}
          >
            Update
          </Button>
        </>
      }
      onCancel={() => {
        setEditName(false);
      }}
    >
      <Form>
        <Row gutter={24}>
          <Col span={24}>
            <div className="zcp-ant-form-label-w-full">
              <Form.Item required={false} colon={false} label="Name">
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [{ required: true, message: `Enter ${props.type} Name ` }],
                })(<Input type="text" placeholder="Enter Name" maxLength={100} size="large" />)}
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
const mapStateToProps = ({ loading }) => ({
  loading: loading.effects['partyPoc/updatePartyName'],
});

export default Form.create()(connect(mapStateToProps, dispatch => ({ dispatch }))(UpdateName));
