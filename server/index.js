const express = require("express");
const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});