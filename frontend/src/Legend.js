import React, { useState, useEffect } from 'react';
import { Cell } from './Grid';

export const Legend = ({ confirmed }) => {
  const [sortedCounts, setSortedCounts] = useState([]);

  useEffect(() => {
    const computed = Object.keys(confirmed).reduce((acc, next) => {
      const owner = confirmed[next];
      return { ...acc, [`${owner}`]: 1 + (acc[owner] || 0) };
    }, {});
    const sorted = Object.keys(computed)
      .reduce((acc, next) => [...acc, { label: next, count: computed[next] }], [])
      .sort((a, b) => (a.count > b.count ? -1 : 1));
    setSortedCounts(sorted);
  }, [confirmed]);

  return (
    <>
      {sortedCounts.map(({ label, count }) => (
        <LegendItem key={label} label={label} count={count} />
      ))}
    </>
  );
};

const LegendItem = ({ label, count }) => (
  <div className="app__legend__item">
    <div className="app__legend__item__cell">
      <Cell owner={label.toLowerCase()} />
    </div>
    <div className="app__legend__item__label">
      {label}: {count || 0}
    </div>
  </div>
);
