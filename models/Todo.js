const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  list: [],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

schema.plugin(uniqueValidator);

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Todo = mongoose.model("Todo", schema);
module.exports = Todo;
