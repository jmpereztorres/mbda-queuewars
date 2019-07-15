import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import './App.css';

import { Grid } from './Grid';
import { Legend } from './Legend';

export const App = () => {
  const [confirmed, dispatch] = useReducer(confirmBlockReducer, emptyConfirmedBlocks);

  const confirmBlock = useCallback(event => {
    try {
      const { id, owner } = JSON.parse(event.data);
      dispatch({ type: 'confirm-one', id, owner });
    } catch (e) {
      console.error('Unable to process web socket event', e, event);
    }
  }, []);

  useEffect(() => {
    fetch('/api/block')
      .then(b => b.json())
      .then(confirmed => dispatch({ type: 'confirm-many', confirmed }))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    const ws = buildWebSocket();
    ws.addEventListener('message', confirmBlock);
    return () => ws.removeEventListener('message', confirmBlock);
  }, [confirmBlock]);

  const grid = useMemo(() => <Grid confirmed={confirmed} cellCount={1600} />, [confirmed]);

  return (
    <div className="app">
      <div className="app__grid">{grid}</div>
      <div className="app__legend">
        <Legend confirmed={confirmed} />
      </div>
    </div>
  );
};

const emptyConfirmedBlocks = {};

function confirmBlockReducer(state = {}, action) {
  switch (action.type) {
    case 'confirm-many':
      return action.confirmed;
    case 'confirm-one':
      return { ...state, [`${action.id}`]: action.owner };
    default:
      return state;
  }
}

function buildWebSocket() {
  const { protocol, host } = window.location;
  const wsProtocol = protocol === 'https' ? 'wss' : 'ws';
  const url = process.env.NODE_ENV === 'development' ? 'ws://localhost:9000/api/ws' : `${wsProtocol}://${host}/api/ws`;
  return new WebSocket(url);
}
