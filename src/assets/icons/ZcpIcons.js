import React from 'react';

const Exclamation = ({
  style = {},
  fill = 'none',
  strokeWidth = '2',
  className = 'w-8 h-8',
  viewBox = '0 0 24 24',
}) => (
  <svg
    style={style}
    className={className}
    fill={fill}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox={viewBox}
  >
    {' '}
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />{' '}
  </svg>
);

const Search = ({
  style = {},
  width = '24',
  height = '24',
  strokeWidth = '2',
  className = '',
  circleRadius = '7',
  viewBox = '0 0 24 24',
}) => (
  <svg
    width={width}
    height={height}
    style={style}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox={viewBox}
  >
    {' '}
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="10" cy="10" r={circleRadius} />
    <line x1="21" y1="21" x2="15" y2="15" />
  </svg>
);

const Clear = ({
  style = {},
  width = '24',
  height = '24',
  fill = 'none',
  strokeWidth = '2',
  className = '',
  viewBox = '0 0 24 24',
}) => (
  <svg
    width={width}
    className={className}
    height={height}
    style={style}
    fill={fill}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox={viewBox}
  >
    <path d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

export default { Exclamation, Search, Clear };
