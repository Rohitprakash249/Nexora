const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
