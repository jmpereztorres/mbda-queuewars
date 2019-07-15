function computeSolutions(grid) {
  const solutions = grid.reduce((a, c) => {
    a[c.parent] = a[c.parent] || [];
    a[c.parent].push(c.id);
    return a;
  }, {});
  Object.keys(solutions).forEach(k => solutions[k].sort());
  return solutions;
}

function arrayEquals(a, b) {
  if (a && b && a.length === b.length) {
    return a.sort().join(",") === b.sort().join(",");
  }
  return false;
}

function fail(res, code, message) {
  res
    .status(400)
    .type("text/plain")
    .send(message);
}

module.exports = {
  arrayEquals,
  computeSolutions,
  fail
};
