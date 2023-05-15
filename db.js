const config = require("./utils/config");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(config.DB)
  .then(() => console.log("connected to DB"))
  .catch((e) => console.log("Something occured ", e.message));
