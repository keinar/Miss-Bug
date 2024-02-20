import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/utilService.js'

export const bugService = {
  query,
  getById,
  remove,
  save,
}

var bugs = utilService.readJsonFile('./data/bug.json')
const PAGE_SIZE = 6

async function query(filterBy = {}, sortBy = {}) {
  try {
    let bugsToReturn = [...bugs];
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i');
      bugsToReturn = bugsToReturn.filter(bug => (bug.title || bug.description) && regExp.test(bug.title || bug.description));
    }
    if (filterBy.severity) {
      bugsToReturn = bugsToReturn.filter(bug => bug.severity === filterBy.severity);
    }
    if (filterBy.labels) {
      bugsToReturn = bugsToReturn
        .filter(bug => bug.labels?.some(label => filterBy.labels.includes(label)))
    }
    if (sortBy.sortField) {
      bugsToReturn.sort((a, b) => {
        const aValue = a[sortBy.sortField];
        const bValue = b[sortBy.sortField];
        return (aValue > bValue ? 1 : -1) * sortBy.sortDir;
      });
    }
    if (filterBy.pageIdx) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE;
      bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE);
    }
    return bugsToReturn;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    var bug = bugs.find(bug => bug._id === bugId)
    if (!bug) throw `Couldn't find bug with _id ${bugId}`
    return bug
  } catch (err) {
    loggerService.error(err)
    throw (err)
  }
}

async function remove(bugId, loggedInUser) {
  try {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) throw `Couldn't find bug with _id ${bugId}`
    const bug = bugs[idx]
    if (!loggedInUser.isAdmin && bug.owner._id !== loggedInUser._id) throw { msg: 'You are not the owner of this bug', code: 403 }

    bugs.splice(idx, 1)
    await _saveBugsToFile('./data/bug.json')
  } catch (err) {
    loggerService.error(err)
    throw err
  }
}

async function save(bugToSave, loggedInUser) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
      if (idx === -1) throw `Couldn't find bug with _id ${bugToSave._id}`

      const bug = bugs[idx];
      bugToSave.createdAt = bug.createdAt;
      if (!loggedInUser?.isAdmin && bug.owner._id !== loggedInUser?._id) throw { msg: 'You are not the owner of this bug', code: 403 }

      bugs.splice(idx, 1, { ...bug, ...bugToSave })
    } else {
      bugToSave._id = utilService.makeId();
      bugToSave.owner = { _id: loggedInUser._id, fullname: loggedInUser.fullname }
      bugToSave.createdAt = Date.now();
      bugs.push(bugToSave)
    }
    await _saveBugsToFile('./data/bug.json')
    return bugToSave
  } catch (err) {
    loggerService.error(err)
    throw err
  }
}

function _saveBugsToFile(path) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2)
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}