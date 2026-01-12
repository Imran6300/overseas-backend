const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("ejs", path.join(__dirname, "views"));

app.listen(3005, () => {
  console.log("Server Is Started....");
});
