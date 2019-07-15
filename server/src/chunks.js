const { fail } = require("./helpers");

const PAGE_SIZE = 10;

const paginateChunksHandler = grid => (req, res) => {
  const page = parseInt(req.params.page);
  if (isNaN(page)) {
    fail(res, 400, "Bad Request, page parameter should be a number.");
    return;
  }
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const data = grid.slice(start, end);
  if (!data || data.length === 0) {
    fail(res, 404, `No more data. Start: ${start}, End: ${end}`);
    return;
  }
  res.send({ start, end, data });
};

module.exports = { paginateChunksHandler };
