import fs from "fs";

import { loggerService } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";

export const bugService = {
  query,
  getById,
  remove,
  save,
};

const bugs = utilService.readJsonFile("./data/bug.json");
const PAGE_SIZE = 4;

async function query(filterBy = {}) {
  try {
    let bugsToReturn = [...bugs];

    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i");
      bugsToReturn = bugsToReturn.filter((bug) => regExp.test(bug.text));
    }

    if (filterBy.minSpeed) {
      bugsToReturn = bugsToReturn.filter(
        (bug) => bug.speed >= filterBy.minSpeed
      );
    }

    if (filterBy.pageIdx !== undefined) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE;
      bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE);
    }

    return bugsToReturn;
  } catch (err) {
    loggerService.error(`Had problems getting bugs...`);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    return bug;
  } catch (err) {
    loggerService.error(`Had problems getting bug ${bugId}...`);
    throw err;
  }
}

async function remove(bugId) {
  try {
    const idx = bugs.findIndex((bug) => bug._id === bugId);
    if (idx === -1) {
      throw new Error(`Bug with ID ${bugId} not found`);
    }
    bugs.splice(idx, 1);

    _saveBugsToFile("./data/bug.json");
  } catch (err) {
    loggerService.error(`Had problems removing bug ${bugId}...`);
    throw err;
  }
  return `Bug ${bugId} removed`;
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx === -1) throw "Bad Id";
      bugs.splice(idx, 1, bugToSave);
    } else {
      bugToSave._id = utilService.makeId();
      bugs.push(bugToSave);
    }
    _saveBugsToFile("./data/bug.json");
  } catch (err) {
    loggerService.error(`Had problems saving bug ${bugToSave._id}...`);
    throw err;
  }
  return bugToSave;
}

function _saveBugsToFile(path) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
