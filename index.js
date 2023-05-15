const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const userRouter = require("./controllers/userRouter");

app.use(cors());
app.use(express.json());

require("./db");

app.use(middleware.requestLogger);
app.use("/api/users", userRouter);

app.get("/api/todo", (req, res) => res.send("Welcome to Todo-List-Api"));

app.listen(config.PORT, () =>
  console.log(`app running on port ${config.PORT}`)
);
