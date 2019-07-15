const grid = require("../data/grid");

const sums = grid.reduce((a, c) => {
  a[c.parent] = (a[c.parent] || 0.0) + c.weight;
  return a;
}, {});

const invalid = [];
Object.keys(sums).forEach(k => {
  if (sums[k] != 1) {
    invalid.push(k);
  }
});

if (invalid.length !== 0) {
  console.log("Invalid:", invalid);
  process.exit(-1);
}
