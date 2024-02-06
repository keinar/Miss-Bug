import express from "express";
import cors from "cors";
import { bugService } from "./services/bug.service.js";
import { loggerService } from "./services/logger.service.js";

const app = express();
const port = 3030;

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello Bugs!");
});

app.get("/api/bug", async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (err) {
    res.status(400).send(`Couldn't get bugs...`);
    loggerService.error(`Couldn't get bug...`);
  }
});

app.get("/api/bug/save", async (req, res) => {
  const {
    _id,
    title = "empty title",
    description = "empty description",
    severity,
  } = req.query;
  const bugToSave = {
    _id,
    title,
    description,
    severity: +severity,
    createdAt: Date.now(),
  };

  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send(`Couldn't save bug...`);
    loggerService.error(`Couldn't save bug... `);
  }
});

app.get("/api/bug/:bugId", async (req, res) => {
  try {
    let { bugId } = req.params;
    const bug = await bugService.getById(bugId);
    if (!bug) {
      res.status(404).send(`Bug with ID ${bugId} not found.`);
    } else {
      res.send(bug);
    }
  } catch (err) {
    console.log("Couldn't get bugs");
    res.status(500).send(`Server error while retrieving bug with ID ${bugId}.`); //
    loggerService.error(`Couldn't get bug ${bugId} `);
  }
});

app.get("/api/bug/:bugId/remove", async (req, res) => {
  var { bugId } = req.params;

  try {
    await bugService.remove(bugId);
    res.send(`bug ${bugId} removed`);
  } catch (err) {
    res.status(400).send(`Couldn't remove bug ${bugId} `);
    loggerService.error(`Couldn't remove bug ${bugId} `);
  }
});

app.listen(port, () => {
  loggerService.info("Up and running on port", port);
});
