const fs = require("fs");
const path = require("path");
const express = require("express");
const { nanoid } = require("nanoid");

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
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    console.log("NOTES:", data);
    if (err) {
      return res.status(500).json(err);
    }
    res.json(JSON.parse(data));
  })
);

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    const oldNotes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = nanoid();
    const updatedNotes = [newNote, ...oldNotes];

    fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => {
      if (err) return res.status(500).json(err);
      res.json(updatedNotes);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    const oldNotes = JSON.parse(data);
    const filterNotes = oldNotes.filter((note) => {
      if (note.id === req.params.id) {
        return false;
      }
      return true;
    });
    fs.writeFile("./db/db.json", JSON.stringify(filterNotes), (err) => {
      if (err) return res.status(500).json(err);
      res.json(filterNotes);
    });
  });
});

// GET Route for index.html
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
