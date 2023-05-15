require("dotenv").config();

const DB = process.env.DB;
const PORT = process.env.PORT;

module.exports = { DB, PORT };
