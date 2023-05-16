const User = require("../models/User");

const handleUserId = async (id, response) => {
  if (!id) {
    throw new Error("please provide user id");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new Error("Invalid userId");
  }

  return user;
};

module.exports = handleUserId;
