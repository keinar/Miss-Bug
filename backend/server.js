import express from "express";
import cors from "cors";
import { loggerService } from "./services/logger.service.js";
import { bugService } from "./api/bugs/bug.service.js";

const app = express();
const port = 3030;

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());

// get all bugs
app.get("/api/bug", async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (err) {
    res.status(400).send(`Couldn't get bugs...`);
    loggerService.error(`Couldn't get bug...`);
  }
});

// get bug by id
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

// create a new bug
app.post("/api/bug", async (req, res) => {
  const {
    _id,
    title = "empty title",
    description = "empty description",
    severity,
    labels,
  } = req.body;

  const bugToSave = {
    _id,
    title,
    description,
    severity: +severity,
    labels,
    createdAt: Date.now(),
  };

  if (severity < 1 || severity > 5) {
    return res.status(400).send(`Severity must be between 1 and 5.`);
  }

  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send(`Couldn't save bug...`);
    loggerService.error(`Couldn't save bug... `);
  }
});

// update a bug
app.put("/api/bug", async (req, res) => {
  const {
    _id,
    title = "empty title",
    description = "empty description",
    severity,
  } = req.body;

  const bugToSave = {
    _id,
    title,
    description,
    severity: +severity,
    createdAt: Date.now(),
  };

  if (severity < 1 || severity > 5) {
    return res.status(400).send(`Severity must be between 1 and 5.`);
  }

  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send(`Couldn't save bug...`);
    loggerService.error(`Couldn't save bug... `);
  }
});

// delete a bug by id
app.delete("/api/bug/:bugId", async (req, res) => {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.send(`bug ${bugId} removed`);
  } catch (err) {
    res.status(400).send(`Couldn't remove bug ${bugId}, make sure it exists`);
    loggerService.error(`Couldn't remove bug ${bugId}, make sure it exists `);
  }
});

app.listen(port, () => {
  loggerService.info("Up and running on port", port);
});
