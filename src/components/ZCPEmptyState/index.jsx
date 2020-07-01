import React from 'react';

const ZCPEmptyState = ({ emptyState, renderButtons, type }) => (
  <div className="text-center py-10 bg-white">
    <div className="text-center">
      <img className="mx-auto" src={emptyState} alt="No address" style={{ height: '150px' }} />
    </div>
    <p className="text-lg font-bold text-blue-800 mb-4">No {type} added yet!</p>
    <p className="text-sm my-4 ">Once you have {type} they will show up here.</p>
    <br />
    {renderButtons && renderButtons()}
  </div>
);

export default ZCPEmptyState;
