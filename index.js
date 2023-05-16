const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const userRouter = require("./controllers/userRouter");
const todoRouter = require("./controllers/todoRouter");

app.use(cors());
app.use(express.json());

require("./db");

app.use(middleware.requestLogger);
app.use(middleware.idExtractor);
app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);

app.get("/api/todo", (req, res) => res.send("Welcome to Todo-List-Api"));

app.listen(config.PORT, () =>
  console.log(`app running on port ${config.PORT}`)
);
