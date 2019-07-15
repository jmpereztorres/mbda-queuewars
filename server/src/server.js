const { version } = require("../package.json");

const express = require("express");
const app = express();
const server = require("http").Server(app);
const expressWs = require("express-ws")(app, server);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static("public"));

const { ioFactory } = require("./io");
const io = ioFactory();

const { confirmBlockHandler } = require("./blocks");
const { paginateChunksHandler } = require("./chunks");
const { computeSolutions } = require("./helpers");

const grid = require("../data/grid");
const solutions = computeSolutions(grid);
const confirmed = {};

app.ws("/api/ws", function(ws, req) {
  const clientId = io.register(ws);
  console.log("WebSocket connected", clientId);
  ws.on("close", () => {
    console.log("WebSocket disconnected", clientId);
    io.unregister(clientId);
  });
});

app.get("/api/chunk/:page", paginateChunksHandler(grid));
app.get("/api/ping", (_, res) => res.send({ pong: new Date(), version }));
app.get("/api/block", (_, res) => res.send(confirmed));
app.post("/api/block/:blockId", confirmBlockHandler(io, solutions, confirmed));

// setInterval(function() {
//   const items = ["one", "two", "three", "four", "five", "six"];
//   const owner = items[Math.floor(Math.random() * items.length)];
//   const id = parseInt((Math.random() * 1000).toString().split(".")[0]);
//   console.log("Broadcast test", { id, owner });
//   confirmed[id] = owner;
//   io.broadcast({ id, owner });
// }, 1000);

const port = process.env.NODE_ENV === "production" ? 80 : 9000;
server.listen(port, () => console.log(`Listening on port ${port}`));
