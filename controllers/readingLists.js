const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");

const blogFindByID = async (req, res, next) => {
  req.blog = await Blog.findOne({
    where: {
      id: req.body.blogId,
    },
  });
  next();
};

const userFinder = async (req, res, next) => {
  req.loggedUser = await User.findByPk(req.decodedToken.id);
  next();
};

router.post("/", blogFindByID, userFinder, async (req, res) => {
  const newList = await ReadingList.create({
    userId: req.loggedUser.id,
    blogId: req.blog.id,
  });
  res.json(newList);
});

router.put("/:id", userFinder, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);
  if (!readingList) {
    res.status(404).send({ error: "Reading list entry does not exist" });
  } else if (readingList.userId !== req.loggedUser.id) {
    res
      .status(401)
      .send({ error: "Users can only mark blogs in their own reading lists" });
  } else {
    await readingList.update({ read: req.body.read });
    res.json(readingList);
  }
});

module.exports = router;
