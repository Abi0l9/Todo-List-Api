const User = require("../models/User");
const Todo = require("../models/Todo");
const handleUserId = require("../utils/handlers");
const router = require("express").Router();

// const handleUserId = async (id, response) => {
//   if (!id) {
//     return response.send("please provide user id").end();
//   }

//   const user = await User.findById(id);
//   if (!user) {
//     return response.send("Invalid userId");
//   }

//   return user;
// };

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
  const user = await handleUserId(request.userId, response);
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
  const newTodo = new Todo({ ...body, user: user._id });

  await newTodo.save();
  user.todos = user.todos.concat(newTodo);
  await user.save();

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

//delete a todo
router.delete("/:todoId", async (request, response) => {
  const todoId = request.params.todoId;

  const todo = await Todo.findOneAndDelete(todoId);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found..." });
  }

  return response.status(200).json(todo);
});

//append to a todo list
router.patch("/:todoId/list", async (request, response) => {
  const getUser = await handleUserId(request.userId, response);

  const todoId = request.params.todoId;
  if (!todoId) {
    return response.status(400).json({ error: "Please, include the todo id" });
  }

  const user = await User.findById(request.userId).populate("todos", {
    title: 1,
    description: 1,
    list: 1,
    completed: 1,
  });

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  const mainTodo = await Todo.findById(todoId);

  const userTodo = user.todos.find((todo) => todo.id === todoId);

  if (!(mainTodo || userTodo)) {
    return response.status(404).json({ error: "Todo does not exist." });
  }

  const newItem = request.body.items;

  userTodo.list = userTodo.list.concat(newItem);
  mainTodo.list = mainTodo.list.concat(newItem);
  try {
    user.save();
    mainTodo.save();
  } catch (e) {
    return response.json({ error: e.message });
  }
  return response.json({ newItem });
});

router.get("/:todoId/list/:itemId", async (request, response) => {
  const getUser = await handleUserId(request.userId, response);

  const { todoId, itemId } = request.params;

  if (!todoId) {
    return response.status(400).json({ error: "Please, include the todo id" });
  }

  const user = await User.findById(request.userId).populate("todos", {
    title: 1,
    description: 1,
    list: 1,
    completed: 1,
  });

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  const userTodo = user.todos.find((todo) => todo.id === todoId);

  if (!userTodo) {
    return response.status(404).json({ error: "Todo does not exist." });
  }
  const item = userTodo.list.find((utd) => utd._id.toString() === itemId);

  if (!item) {
    return response.status(404).json({ error: "Item does not exist." });
  }

  return response.status(200).json({ item }).end();
});

router.get("/:todoId/list", async (request, response) => {
  const getUser = await handleUserId(request.userId, response);

  const { todoId } = request.params;

  if (!todoId) {
    return response.status(400).json({ error: "Please, include the todo id" });
  }

  const user = await User.findById(request.userId).populate("todos", {
    title: 1,
    description: 1,
    list: 1,
    completed: 1,
  });

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  const userTodo = user.todos.find((todo) => todo.id === todoId);

  if (!userTodo) {
    return response.status(404).json({ error: "Todo does not exist." });
  }
  const items = userTodo.list;

  return response.status(200).json({ items }).end();
});

module.exports = router;
