const express = require("express");
const { getAsync } = require("../redis");
const router = express.Router();

/* GET cached statistics. */
router.get("/", async (_, res) => {
  const createdTodos = await getAsync("added_todos");
  res.json({
    added_todos: createdTodos || 0,
  });
});

module.exports = router;
