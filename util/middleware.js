const Session = require("../models/session");
const User = require("../models/user");

const { SECRET } = require("./config");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET);
      
      const sessionIsValid = decodedToken.sessionId && (await Session.findByPk(decodedToken.sessionId));
      
      if (sessionIsValid) {
        req.decodedToken = decodedToken;
      } else {
        return res.status(401).json({ error: "session expired" });
      }

    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  next();
};

const userExtractor = async (req, res, next) => {
  if (req.decodedToken && req.decodedToken.id) {
    const loggedUser = await User.findByPk(req.decodedToken.id);

    if (loggedUser.disabled) {
      await Session.destroy({where: {id: req.decodedToken.sessionId}});
      return res.status(401).json({ error: "user disabled" });
    }

    req.loggedUser = loggedUser
  }
  next();
};

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "TypeError") {
    return response.status(500).json({ error: error.message });
  } else {
    return response.status(400).json({ error: error.message });
  }
};

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
