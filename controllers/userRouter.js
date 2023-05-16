const Todo = require("../models/Todo");
const User = require("../models/User");
const router = require("express").Router();

router.get("", async (request, response) => {
  const user = await User.findById(request.userId).populate("todos", {
    title: 1,
    description: 1,
    list: 1,
    completed: 1,
  });

  return response.json({ user });
});

//all
router.get("/all", async (request, response) => {
  const user = await User.find({}).populate("todos", {
    title: 1,
    description: 1,
    list: 1,
    completed: 1,
  });

  return response.json({ user });
});

router.post("", async (request, response) => {
  const { username } = request.body;
  const userExists = await User.findOne({ username });

  if (userExists) {
    return response.status(422).json({ error: "User already exists" });
  }

  if (username.length < 3) {
    return response.status(400).json({ error: "Minimum length is 3" });
  }

  const newUser = new User({ username });

  try {
    await newUser.save();
  } catch (e) {
    console.log(e.message);
  }

  return response.status(201).json({ user: newUser });
});

//append an item to todolist
router.patch("/:todoId", async (request, response) => {
  const user = await User.findById(request.userId);
  const todoId = request.params.todoId;
});

module.exports = router;
