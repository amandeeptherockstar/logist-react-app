import React from 'react';
import PropTypes from 'prop-types';
/**
 *
 *@ZCPCheckValidation - The purpose of this component to weather render the children
  or not based on the @show prop.
 */
const ZCPCheckValidation = ({ show, children }) => {
  if (show) {
    return <>{children}</>;
  }
  return null;
};

ZCPCheckValidation.propTypes = {
  /**
   * @show {boolean}- is the boolean value if it is true then children will display.
   * @children {element}- is the jsx element which will render if show is true
   */
  show: PropTypes.bool,
  children: PropTypes.element,
};

ZCPCheckValidation.defaultProps = {
  /**
   * @show is false by default
   * @children is set empty div by default
   */
  show: false,
  children: <div />,
};

export default ZCPCheckValidation;
