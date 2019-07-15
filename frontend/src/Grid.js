import React from 'react';

export const Grid = ({ confirmed, cellCount }) => {
  const grid = [];
  for (var i = 0; i < cellCount; i++) {
    grid.push(<Cell key={i} owner={confirmed[i]} />);
  }
  return <div className="grid">{grid}</div>;
};

export const Cell = ({ owner }) => <div className={`cell cell--${owner || 'none'}`} />;
