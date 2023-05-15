const User = require("../models/User");
const router = require("express").Router();

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

module.exports = router;
