const fs = require("fs");
const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET Route for notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  })
);

app.post("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json.parse(data);
  });
  fs.writeFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json.stringify(data);
  });
});

// app.delete("/api/notes/:id", (req, res) => res.send(""));

// GET Route for index.html
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
