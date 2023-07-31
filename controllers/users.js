const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: {
      model: Blog,
      attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    await user.update({ username: req.body.username });
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.get("/:id", async (req, res) => {
  const where = {};
  if (req.query.read) {
    where.read = req.query.read === "true";
  }
  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: "readings",
      attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
      through: {
        attributes: ["read", "id"],
        where,
      },
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
