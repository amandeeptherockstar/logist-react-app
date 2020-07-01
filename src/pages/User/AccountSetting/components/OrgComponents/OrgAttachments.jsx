import { Row, Icon, Button, Upload, Spin, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { hostname } from '@/pages/hostUrl';
import styles from './styles.less';
import Wrapper from './Wrapper';
import PDF from '../../../../../assets/file-types/pdf-icon.svg';
import PNG from '../../../../../assets/file-types/png.svg';
import JPG from '../../../../../assets/file-types/jpg.svg';
import DOC from '../../../../../assets/file-types/doc.svg';
import GIF from '../../../../../assets/file-types/gif.svg';
import TXT from '../../../../../assets/file-types/txt.svg';

const { Dragger } = Upload;

const OrgAttachments = props => {
  const { dispatch } = props;

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ unloading: [] });
  const { vendorId } = props;

  const settings = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    headers: {
      accessToken: localStorage.getItem('accessToken'),
    },
  };

  const onRemove = ({ id }) => {
    // setLoading(true);
    const load = state.unloading.slice();
    load[id] = true;
    setState({
      unloading: load,
    });
    props.dispatch({
      type: 'userAccountSetting/deleteOrgAttachment',
      payload: {
        vendorId,
        contentId: id,
        cb: () => {
          setLoading(false);
          dispatch({ type: 'userAccountSetting/getOrgAttachments', payload: { orgId: vendorId } });
        },
      },
    });
  };

  const markAttachmentHandler = async attachment => {
    // handle mark attachment here
    await props.dispatch({
      type: 'userAccountSetting/updateOrgAttachment',
      payload: {
        vendorId: props.vendorId,
        attachmentId: attachment.id,
        body: {
          id: attachment.id,
          is_attachable: !attachment.is_attachable,
        },
      },
    });
  };

  const getAtachmentType = contentName => {
    const contentNameFormatted = contentName.toUpperCase();
    const contentType = contentNameFormatted.substring(
      contentNameFormatted.lastIndexOf('.') + 1,
      contentNameFormatted.length,
    );
    switch (contentType) {
      case 'PDF':
        return <img className={styles.image} src={PDF} alt="PDF" />;
      case 'PNG':
        return <img className={styles.image} src={PNG} alt="PNG" />;
      case 'JPG':
        return <img className={styles.image} src={JPG} alt="JPG" />;
      case 'DOC':
        return <img className={styles.image} src={DOC} alt="DOC" />;
      case 'GIF':
        return <img className={styles.image} src={GIF} alt="GIF" />;
      case 'TXT':
        return <img className={styles.image} src={TXT} alt="TXT" />;
      default:
        return <img className={styles.image} src={PNG} alt="PNG" />;
    }
  };

  const downloadAttchmentFile = attachment => {
    const load = state.unloading.slice();
    load[attachment.id] = true;
    setState({
      unloading: load,
    });
    const urll = attachment.download_url;
    fetch(`${urll}`).then(response => {
      response.blob().then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${attachment.name}`;
        load[attachment.id] = false;
        setState({
          unloading: load,
        });
        a.click();
      });
    });
  };

  useEffect(() => {
    // get the list of vendor attachments
    props.dispatch({
      type: 'userAccountSetting/getOrgAttachments',
      payload: { orgId: props.vendorId },
    });
    return () => {};
  }, []);
  return (
    <>
      <Spin spinning={loading} delay={500}>
        <Row>
          <Dragger
            action={`${hostname()}/xapi/v1/supplier/${
              props.vendorId
            }/attachments?is_attachable=true`}
            headers={{ accessToken: localStorage.getItem('accessToken') }}
            // eslint-disable-next-line arrow-body-style
            beforeUpload={() => {
              setLoading(true);
              return 1;
            }}
            onError={() => {
              setLoading(false);
            }}
            onSuccess={() => {
              setTimeout(() => {
                props.dispatch({
                  type: 'userAccountSetting/getOrgAttachments',
                  payload: { orgId: props.vendorId },
                });
                setLoading(false);
              }, 100);
            }}
            {...settings}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text mb-2">Click or drag documents to this area to upload</p>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Dragger>
        </Row>

        <div style={{ marginLeft: '30px' }}>
          <Row className="ant-upload-list ant-upload-list-picture-card" gutter={24}>
            <ul className={[styles.inlineList, styles.tileList, styles.fsdAttachments].join(' ')}>
              {props.orgAttachments.map(attachment => (
                <>
                  <li>
                    <Spin spinning={state.unloading[attachment.id] || false} delay={0}>
                      <a
                        className={[
                          styles.docPreviewWrapper,
                          `${attachment.is_attachable && styles.active}`,
                        ].join(' ')}
                      >
                        <Wrapper
                          checked={attachment.is_attachable}
                          markAttachmentHandler={() => markAttachmentHandler(attachment)}
                        >
                          <div className={styles.aSH}>
                            <span>
                              <a
                                className="ant-upload-list-item-thumbnail"
                                href={attachment.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={attachment.thumbnail_url}
                                  alt={attachment.name}
                                  className={styles.listItemImage}
                                />
                              </a>
                            </span>
                            <div className={styles.aYy}>
                              <div className={styles.aYA}>{getAtachmentType(attachment.name)}</div>
                              <div className={styles.aYz}>
                                <div className={styles.aQA}>
                                  <div className={styles.aV3} id=":lj">
                                    {attachment.name}
                                  </div>

                                  <div className={styles.font_mi}>{attachment.size_formatted}</div>
                                </div>
                                <div className={styles.ayp}>
                                  <div
                                    className={[styles.font_mi, styles.font_shade_light].join(' ')}
                                  >
                                    {attachment.id ? 'General Document' : ''}
                                  </div>
                                  <div className={styles.m_t_5}>
                                    <span className={styles.btn_attachment_action}>
                                      <a
                                        title="Download file"
                                        onClick={() => downloadAttchmentFile(attachment)}
                                      >
                                        <Icon type="download" fill="currentColor" />
                                      </a>
                                    </span>
                                    <span
                                      className={[styles.btn_attachment_action, styles.m_l_10].join(
                                        ' ',
                                      )}
                                    >
                                      <Popconfirm
                                        title="Are you sure to delete this Attachment?"
                                        cancelText="Cancel"
                                        okText="Delete"
                                        okType="danger"
                                        onConfirm={() => onRemove({ id: attachment.id })}
                                      >
                                        <i
                                          aria-label="icon: delete"
                                          title="Delete file"
                                          tabIndex="-1"
                                          style={{ color: '#e81123' }}
                                          className="anticon anticon-delete"
                                        >
                                          <svg
                                            viewBox="64 64 896 896"
                                            focusable="false"
                                            className=""
                                            data-icon="delete"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden="true"
                                          >
                                            <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                                          </svg>
                                        </i>
                                      </Popconfirm>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Wrapper>
                      </a>{' '}
                    </Spin>
                  </li>
                </>
              ))}
            </ul>
          </Row>
        </div>
      </Spin>
    </>
  );
};

const mapStateToProps = state => ({
  orgAttachments: state.userAccountSetting.orgAttachments,
});

export default connect(mapStateToProps, dispatch => ({ dispatch }))(OrgAttachments);
