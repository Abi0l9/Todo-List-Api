const User = require("../models/User");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  request.body && console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const idExtractor = (request, response, next) => {
  const userId = request.get("authorization");

  request.userId = userId;

  next();
};
module.exports = { requestLogger, idExtractor };
