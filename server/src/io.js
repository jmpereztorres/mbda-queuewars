const ioFactory = () => {
  let lastClientId = 0;
  const clients = {};
  return {
    register: ws => {
      const clientId = ++lastClientId;
      clients[clientId] = ws;
      return clientId;
    },
    unregister: clientId => delete clients[clientId],
    broadcast: message => {
      Object.keys(clients).forEach(clientId => {
        clients[clientId].send(JSON.stringify(message));
      });
    }
  };
};

module.exports = { ioFactory };
