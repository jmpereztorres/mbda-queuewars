const { arrayEquals, fail } = require("./helpers");

const confirmBlockHandler = (io, solutions, confirmed) => (req, res) => {
  const probe = req.body;
  console.log("Probe:", probe);

  if (!probe || !probe.block_id || !probe.chunks || !probe.chunks.length || !probe.owner) {
    fail(res, 400, "Invalid format, should be { owner: 'one', block_id: 42, chunks: ['aa', 'bb'] }");
    return;
  }

  if (confirmed[probe.block_id]) {
    res.sendStatus(409);
    return;
  }

  const solution = solutions[probe.block_id];
  if (!solution) {
    fail(res, 400, `Unknown block_id: ${probe.block_id}`);
    return;
  }

  if (!arrayEquals(solution, probe.chunks)) {
    fail(res, 400, "Invalid solution");
    return;
  }

  confirmed[probe.block_id] = probe.owner;
  io.broadcast({ id: probe.block_id, owner: probe.owner });
  res.sendStatus(200);
};

module.exports = { confirmBlockHandler };
