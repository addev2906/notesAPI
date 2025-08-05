// 1. Notes API
//     Features: CRUD notes (title, content, timestamp)
//     Tech: Node, Express, file-based storage or MongoDB
//     Bonus: Add tags and search notes by tag

import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'output.json');

const app = express();

const port = 3000;

var lastId = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        res.json(JSON.parse(data));
    })

})
app.post("/api/post", (req, res) => {
    lastId += 1;
    const newNote = {
        title: req.body.title,
        content: req.body.content,
        timestamp: new Date(),
    }
    fs.readFile(filePath, 'utf8', (err, data) => {

        if (err) {
            console.log("Could not read file.");
            return;
        }
        let notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(filePath, JSON.stringify(notes, null, '\t'), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Output written to output.json successfully");
            }
        })
    });
})

app.patch("/api/edit/:title", (req, res) => {
    const selTitle = req.params.title;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Could not read file.' });
        }
        let notes = [];
        notes = JSON.parse(data);

        const note = notes.find(n => selTitle === n.title);
        console.log(note);

        note.title = req.body.title || note.title;
        note.content = req.body.content || note.content;

        res.json(notes);
    });
})

app.delete("/api/delete/:title", (req, res) => {
    const selTitle = req.params.title;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        var jsonArray = JSON.parse(data);

        var filteredNotes = jsonArray.filter(note => selTitle != note.title);

        fs.writeFile(filePath, JSON.stringify(filteredNotes, null, "\t"), (err) => {
            if (err) {
                console.log(err);
            }
        })

        res.json(filteredNotes);
    })
})

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
})