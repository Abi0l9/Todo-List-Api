const mongoose = require("mongoose");

const TodoItem = mongoose.Schema({
  item: {
    type: String,
    required: true,
    index: true,
    sparse: true,
  },
});

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  list: [TodoItem],
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    // delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Todo = mongoose.model("Todo", schema);
module.exports = Todo;
