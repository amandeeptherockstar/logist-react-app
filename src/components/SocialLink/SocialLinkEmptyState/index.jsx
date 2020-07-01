import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 *@SocialLinkEmptyState - The purpose of this component to add the ability to Add the Social Links
  based on @type prop.
 */

const SocialLinkEmptyState = ({
  type,
  subType,
  setSocialLinkHeader,
  setLinkType,
  setSubType,
  setAddLinkedIn,
}) => (
  <div id={`${type}_Empty_Link`}>
    <span
      className="text-gray-500 cursor-pointer"
      onClick={() => {
        setSocialLinkHeader(`Add ${type} ${subType}`);
        setLinkType(type);
        setSubType(subType);
        setAddLinkedIn(true);
      }}
    >
      Add New {type} {subType}
    </span>
  </div>
);

SocialLinkEmptyState.propTypes = {
  /**
   * @type {string} - defines what kind of Social Link it is,
   * possible values are Linked In, Twitter, Facebook
   * @setSocialLinkHeader {string} - defines the title for the Modal
   * @setLinkType {func} - function that sets the Link Type
   * @setAddLinkedIn {func} - function that sets the Newely added Link
   */
  type: PropTypes.string,
  setSocialLinkHeader: PropTypes.string,
  setLinkType: PropTypes.func,
  setAddLinkedIn: PropTypes.func,
};

SocialLinkEmptyState.defaultProps = {
  /**
   * @type defines what kind of Social Link it is, possible values are Linked In, Twitter, Facebook
   * @setSocialLinkHeader defines the title for the Modal
   * @setLinkType function that sets the Link Type
   * @setAddLinkedIn function that sets the Newely added Link
   */
  type: 'Linked In',
  setSocialLinkHeader: 'Add New LinkedIn Link',
  setLinkType: () => {},
  setAddLinkedIn: () => {},
};

export default SocialLinkEmptyState;
