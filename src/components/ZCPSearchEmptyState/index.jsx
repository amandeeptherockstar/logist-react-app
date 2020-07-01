import React from 'react';
import { Divider } from 'antd';
import emptySeatEmptyStateSvg from '@/assets/img/empty-states/empty-search/SVG/empty-search-contact.svg';

const ZCPSearchEmptyState = ({ renderButtons }) => (
  /**
   * @renderButtons is the function which will return us Button.
   */
  <div className="flex content-center align-center h-full justify-center">
    <div className="text-center py-8">
      <div>
        <img
          className="mx-auto"
          src={emptySeatEmptyStateSvg}
          alt="No address"
          style={{ height: '150px' }}
        />
      </div>
      <div className="pt-8">
        <p className="font-bold text-blue-800 text-lg">No matching records found</p>
        <p className="text-gray-600">Try with a different search criteria.</p>
        {renderButtons && renderButtons() && (
          <>
            <p className="py-2">
              <Divider className="text-gray-400">OR</Divider>
            </p>
            <div className="pt-2">
              <p className="text-base mb-4">{renderButtons()}</p>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);

export default ZCPSearchEmptyState;
