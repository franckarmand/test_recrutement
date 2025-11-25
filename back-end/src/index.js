// src/index.js
require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Backend running on http://0.0.0.0:${port}`);
});
