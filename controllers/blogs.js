const router = require("express").Router();

const { Op } = require("sequelize");
const { Blog, User } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const userFinder = async (req, res, next) => {
  req.loggedUser = await User.findByPk(req.decodedToken.id);
  next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        author: {
          [Op.substring]: req.query.search,
        },
      },
      {
        title: {
          [Op.substring]: req.query.search,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: { model: User, attributes: ["name"] },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", userFinder, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.loggedUser.id });
  return res.json(blog);
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", blogFinder, userFinder, async (req, res) => {
  if (!req.blog) {
    res.status(404).end();
  } else if (req.blog.userId !== req.loggedUser.id) {
    res.status(401).end();
  } else {
    await req.blog.destroy();
    res.status(204).end();
  }
});

module.exports = router;
