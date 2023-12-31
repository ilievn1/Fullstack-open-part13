const express = require("express");
const app = express();
require("express-async-errors");
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const middleware = require("./util/middleware.js");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorsRouter = require("./controllers/authors");
const readingListRouter = require("./controllers/readingLists");


app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.use("/api/logout", logoutRouter);
app.use("/api/blogs",blogsRouter);
app.use("/api/readinglists", readingListRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();