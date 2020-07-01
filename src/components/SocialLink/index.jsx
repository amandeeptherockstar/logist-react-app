import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Icon, Popover, Divider, Tooltip } from 'antd';
/**
 *
 *@SocialLink - The purpose of this component to Display the Social Link
 along with Edit and Delete Functionality
 */

const SocialLink = props => {
  const {
    type,
    subType,
    icon,
    theme,
    setSubType,
    setAddLinkedIn,
    address,
    setEditSocialLink,
    setSocialLink,
    setEditSocialLinkId,
    deleteSocialLink,
    setSocialLinkHeader,
    setLinkType,
    partyType,
  } = props;

  let addressPropertyName = '';
  if (partyType === 'employee') {
    addressPropertyName = 'infoString';
  } else if (type === 'LinkedIn') {
    addressPropertyName = 'linkedIn_address';
  } else if (type !== 'LinkedIn') {
    addressPropertyName = 'user_name';
  }
  const [visible, setVisible] = useState(false);

  const handleDeleteConfirm = () => {
    if (partyType === 'employee') {
      deleteSocialLink(address.contactMechId, type, subType);
    } else {
      deleteSocialLink(address.contact_mech_id, type, subType);
    }
  };

  const handleEditClick = () => {
    setEditSocialLink(true);
    setLinkType(type);
    setSubType(subType);
    setSocialLinkHeader(`Update ${type} ${subType}`);
    setSocialLink(address[addressPropertyName]);
    if (partyType === 'employee') {
      setEditSocialLinkId(address.contactMechId);
    } else {
      setEditSocialLinkId(address.contact_mech_id);
    }
  };

  const handleVisibleChange = visibles => {
    setVisible(visibles);
  };
  const content = (
    <div>
      <p
        className="text-blue-600 cursor-pointer "
        onClick={() => {
          setVisible(false);
          handleEditClick();
        }}
      >
        <Icon className="mr-1" type="edit" /> Edit
      </p>
      <Divider style={{ marginTop: 5, marginBottom: 5 }} />
      <p
        className="pt-1 text-red-600 cursor-pointer"
        onClick={() => {
          setVisible(false);
          handleDeleteConfirm();
        }}
      >
        <Icon className="mr-1" type="delete" />
        Delete
      </p>
    </div>
  );
  let addressType;
  if (address && address.linkedIn_address && type === 'LinkedIn') {
    addressType = address.linkedIn_address;
  } else if (address && address.user_name && type === 'Facebook') {
    addressType = address.user_name;
  } else if (address && address.user_name && type === 'Twitter') {
    addressType = address.user_name;
  } else if (address && address.user_name && type === 'Instagram') {
    addressType = address.user_name;
  } else if (address && address.user_name && type === 'Youtube') {
    addressType = address.user_name;
  } else if (partyType === 'employee' && address && address.infoString) {
    addressType = address.infoString;
  }

  const renderIcon = () => {
    if (type === 'Twitter') {
      return 'twitter-circle';
    }
    return icon;
  };

  const renderIconClass = () => {
    if (type === 'Instagram') {
      return 'text-xl text-red-600';
    }
    if (type === 'Youtube') {
      return 'text-xl text-red-900';
    }
    return 'text-xl text-blue-800';
  };
  // console.log(addressType);
  const renderLinkedIn = () => {
    if (addressType) {
      return (
        <Popover
          getPopupContainer={trigger => trigger.parentNode}
          visible={visible}
          content={content}
          trigger="click"
          onVisibleChange={handleVisibleChange}
          title={
            <Tooltip title={addressType}>
              <a
                onClick={() => {
                  if (addressType) {
                    window.open(
                      addressType.startsWith('https://') ? addressType : `https://${addressType}`,
                      '_blank',
                    );
                  }
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit Link
              </a>
            </Tooltip>
          }
        >
          <Tooltip title="Edit, Delete or Visit Link">
            <Icon
              theme={theme}
              onClick={() => {
                setVisible(true);
              }}
              className={renderIconClass()}
              type={renderIcon()}
            />
          </Tooltip>
        </Popover>
      );
    }
    return (
      <Tooltip title={`Add ${type} ${subType}`}>
        <Icon
          onClick={() => {
            setSocialLinkHeader(`Add ${type} ${subType}`);
            setLinkType(type);
            setSubType(subType);
            setAddLinkedIn(true);
          }}
          className="text-xl"
          type={icon}
        />
      </Tooltip>
    );
  };

  return <div>{renderLinkedIn()}</div>;
};

SocialLink.propTypes = {
  /**
   * @type {string} - defines what kind of Social Link it is,
   * possible values are Linked In, Twitter, Facebook
   */
  type: PropTypes.string,
  /**
   * @subType {string} - defines what kind of Link  it is,
   * possible values are Page, Account, Channel
   */
  subType: PropTypes.string,
  /**  @address {object} - defines details for the link address
   */
  address: PropTypes.object,
  /**
   * @setEditSocialLink {func} - function that sets Link to Edit
   */
  setEditSocialLink: PropTypes.func,
  /**
   * @setSocialLink {func} - function that autopopulate link in the Modal
   */
  setSocialLink: PropTypes.func,
  /**
   * @setEditSocialLinkId {func} - function that sets Link Id
   */
  setEditSocialLinkId: PropTypes.func,
  /**
   * @deleteSocialLink {func} - function that delete Link
   */
  deleteSocialLink: PropTypes.func,
  /**
   * @setSocialLinkHeader {func} - function that sets Modal Header
   */
  setSocialLinkHeader: PropTypes.func,
  /**
   *  @setLinkType {func} - function that sets the Link Type
   */
  setLinkType: PropTypes.func,
  /**
   * @partyType {string} defines what kind of party it is
   */
  partyType: PropTypes.string,
  /**
   * @theme {string} defines what kind of icon theme is
   */
  theme: PropTypes.string,
};

SocialLink.defaultProps = {
  /**
   * @type defines what kind of Social Link it is, possible values are Linked In, Twitter, Facebook
   * @icon defines the icon for the social link
   * @iconColor defines the icon color for the social link
   * @address defines details for the link address
   * @address {object} - defines details for the link address
   */
  type: 'Linked In',
  subType: 'Page',
  partyType: 'employee',
  address: {},
  theme: 'filled',
  setEditSocialLink: () => {},
  setSocialLink: () => {},
  setEditSocialLinkId: () => {},
  deleteSocialLink: () => {},
  setSocialLinkHeader: () => {},
  setLinkType: () => {},
};

export default SocialLink;
