import { Upload, Icon, Message, Tooltip, message, Col, Row, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { hostname } from '@/pages/hostUrl';
import RoleAuthorization from '../RoleAuthorization';

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    Message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    Message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const Image = props => {
  const { partyType, partyId } = props.info;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [contentId, setContentId] = useState('');
  const type = partyType === 'supplier' ? 'Vendor' : 'Customer';
  // state = {
  //   loading: false,
  // };

  useEffect(() => {
    Axios.get(`${hostname()}/xapi/v1/party/${partyId}/profileImage`, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        'content-type': 'application/json',
      },
    })
      .then(url => {
        setImageUrl(url.data.allContentDetails[0].publicResourceUrl);
        setContentId(url.data.allContentDetails[0].contentId);
      })
      .catch(() => {});
  }, []);

  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      const data = new FormData();
      data.append('file', info.file.originFileObj);

      Axios.post(`${hostname()}/xapi/v1/party/${partyId}/profileImage`, data, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
          'content-type': 'application/x-www-form-urlencoded',
        },
      })
        .then(() => {
          message.success(`${info.file.name} file uploaded successfully`);
          setLoading(false);
          return Axios.get(`${hostname()}/xapi/v1/party/${partyId}/profileImage`, {
            headers: {
              accessToken: localStorage.getItem('accessToken'),
              'content-type': 'application/json',
            },
          });
        })
        .then(url => {
          setContentId(url.data.allContentDetails[0].contentId);
          setImageUrl(url.data.allContentDetails[0].publicThumbNailUrl);
        })
        .catch(() => {});
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  const uploadButton = (
    <div id="Upload-Logo">
      <Icon type="plus" />
      <div className="ant-upload-text">{props.employee ? 'Employee' : type} Logo</div>
    </div>
  );
  return (
    <div>
      <Row type="flex" justify="center">
        <Col>
          <Spin spinning={loading}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader partyLogo"
              multiple={false}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={onFileChangeHandler}
            >
              {imageUrl ? (
                <Tooltip title={props.employee ? 'Change Avatar' : 'Change Logo'}>
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                </Tooltip>
              ) : (
                uploadButton
              )}
            </Upload>
          </Spin>
        </Col>
        <Col className="-mt-1 ">
          {imageUrl ? (
            <RoleAuthorization authority={['ORG_ADMIN', 'ORG_MANAGER']}>
              <Tooltip placement="right" title="Remove Logo">
                <Icon
                  type="close-circle"
                  className="text-red-600"
                  onClick={() => {
                    setImageUrl(null);
                    Axios.delete(
                      `${hostname()}/xapi/v1/party/${partyId}/content/${contentId}/profileImage`,
                      {
                        headers: {
                          accessToken: localStorage.getItem('accessToken'),
                          'content-type': 'application/json',
                        },
                      },
                    );
                  }}
                />
              </Tooltip>
            </RoleAuthorization>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

export default Image;
