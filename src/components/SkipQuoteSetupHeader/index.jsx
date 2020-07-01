import React from 'react';

const SkipQuoteSetupHeader = ({ dispatch }) => {
  const skipRemainingSteps = () => {
    dispatch({
      type: 'quoteGuide/skipAllQuoteSetup',
    });
  };
  return (
    <span
      id="skip-quote-guide-wizard"
      className="cursor-pointer text-sm mr-4 text-gray-500"
      onClick={skipRemainingSteps}
      title="Skipping will close this popup and you can continue working on the quote. This
      is just an additional utililty to help you improve your quote quality."
    >
      Skip wizard
    </span>
  );
};

export default SkipQuoteSetupHeader;
