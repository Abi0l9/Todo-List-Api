const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  request.body && console.log("Body:  ", request.body);
  console.log("---");
  next();
};

module.exports = { requestLogger };
