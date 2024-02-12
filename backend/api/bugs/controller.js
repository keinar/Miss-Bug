// Bug CRUDL API
import { bugService } from "./bug.service.js";

// List
export async function getBugs(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || "",
      minSpeed: +req.query.minSpeed || 0,
      pageIdx: req.query.pageIdx || undefined,
    };
    const bugs = await bugService.query(filterBy);
    res.send(bugs);
  } catch (err) {
    res.status(400).send(`Couldn't get bugs`);
  }
}

// Get
export async function getBug(req, res) {
  const { bugId } = req.params;
  const lastBugId = req.cookies.lastBugId;
  try {
    if (lastBugId === bugId) return res.status(400).send("Dont over do it");
    const bug = await bugService.getById(bugId);
    res.cookie("lastBugId", bugId, { maxAge: 5 * 1000 });
    res.send(bug);
  } catch (err) {
    res.status(400).send(`Couldn't get bug`);
  }
}

// // Delete
export async function removeBug(req, res) {
  const { bugId } = req.params;

  try {
    await bugService.remove(bugId);
    res.send("Deleted OK");
  } catch (err) {
    res.status(400).send(`Couldn't remove bug`);
  }
}

// // Save
export async function addBug(req, res) {
  const { vendor, speed } = req.body;
  // Better use createBug()
  const bugToSave = { vendor, speed: +speed };

  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send(`Couldn't save bug`);
  }
}

export async function updateBug(req, res) {
  const { _id, vendor, speed } = req.body;
  const bugToSave = { _id, vendor, speed: +speed };
  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send(`Couldn't save bug`);
  }
}
