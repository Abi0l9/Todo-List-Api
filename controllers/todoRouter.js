const User = require("../models/User");
const Todo = require("../models/Todo");
const router = require("express").Router();

const handleUserId = async (id) => {
  if (!id) {
    return response.send("please provide user id").end();
  }

  const user = await User.findById(id);
  if (!user) {
    return response.send("Invalid userId");
  }

  return user;
};

//get alltodos
router.get("", async (request, response) => {
  const todos = await Todo.find({}).populate("user", { username: 1, id: 1 });

  return response.json({ todos });
});

//retrieve a specific todo
router.get("/:todoId", async (request, response) => {
  const todoId = request.params.todoId;

  const todo = await Todo.findById(todoId).populate("user", {
    username: 1,
    id: 1,
  });

  if (!todo) {
    return response.status(404).json({ error: "Todo not found..." });
  }

  return response.status(200).json({ todo });
});

//create a new todo
router.post("", async (request, response) => {
  const user = await handleUserId(request.userId);
  const reqFields = ["title", "description", "list"];

  const checkFields = Object.keys(request.body).filter((f) =>
    reqFields.includes(f)
  );

  if (reqFields.length !== checkFields.length) {
    return response
      .status(400)
      .json({ error: "required fields missing" })
      .end();
  }

  const body = request.body;
  const newTodo = new Todo({ ...body, user: user.id });

  try {
    await newTodo.save();
    user.todos = user.todos.concat(newTodo);
    await user.save();
  } catch (e) {
    return response.json({ error: e.message });
  }

  return response.status(201).json(newTodo).end();
});

//update todos title and description
router.patch("/:todoId", async (request, response) => {
  const todoId = request.params.todoId;

  const todo = await Todo.findByIdAndUpdate(todoId, request.body);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found..." });
  }

  return response.status(200).json({ message: "todo title updated" });
});

module.exports = router;
