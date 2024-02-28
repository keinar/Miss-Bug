import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/utilService.js'
import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'
export const bugService = {
  query,
  getById,
  remove,
  save,
}

// var bugs = utilService.readJsonFile('./data/bug.json')
const collectionName = 'bug'
const PAGE_SIZE = 6

async function query(filterBy = {}, sortBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy, sortBy);
    const collection = await dbService.getCollection(collectionName);
    const bugCursor = collection.find(criteria.filter).sort(criteria.sort);

    // if (filterBy.pageIdx !== undefined) {
    //   const startIdx = filterBy.pageIdx * PAGE_SIZE;
    //   bugCursor.skip(startIdx).limit(PAGE_SIZE);
    // }

    const bugs = await bugCursor.toArray();
    console.log("criteria: ", criteria);
    console.log('bugs: ', bugs);
    return bugs;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bug = await collection.findOne({ _id: new ObjectId(bugId) });
    if (!bug) throw `Couldn't find bug with _id ${bugId}`;
    return bug;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function remove(bugId, loggedInUser) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const bug = await collection.findOne({ _id: new ObjectId(bugId) });
    if (!bug) throw `Couldn't find bug with _id ${bugId}`;
    if (!loggedInUser.isAdmin && bug.owner?._id !== loggedInUser._id) throw { msg: 'You are not the owner of this bug', code: 403 };

    await collection.deleteOne({ _id: new ObjectId(bugId) });
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function save(bugToSave, loggedInUser) {
  try {
    const collection = await dbService.getCollection(collectionName);
    if (bugToSave._id) {
      const _id = new ObjectId(bugToSave._id);
      delete bugToSave._id; // MongoDB uses _id as ObjectId, not a string.
      const result = await collection.updateOne({ _id }, { $set: bugToSave });
      if (result.matchedCount === 0) throw `Couldn't find bug with _id ${_id}`;
    } else {
      bugToSave.createdAt = Date.now();
      bugToSave.owner = { _id: loggedInUser._id, fullname: loggedInUser.fullname };
      await collection.insertOne(bugToSave);
    }
    return bugToSave;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

function _buildCriteria(filterBy = {}, sortBy = {}) {
  const queryOptions = {
    filter: {},
    sort: {}
  };

  // Building filter criteria
  if (filterBy.txt) {
    queryOptions.filter.$or = [
      { title: { $regex: filterBy.txt, $options: 'i' } },
      { description: { $regex: filterBy.txt, $options: 'i' } }
    ];
  }

  if (filterBy.severity) {
    queryOptions.filter.severity = filterBy.severity;
  }

  if (filterBy.labels && filterBy.labels.length) {
    queryOptions.filter.labels = { $in: [filterBy.labels] };
  }

  if (filterBy.owner) {
    queryOptions.filter['owner.id'] = filterBy.owner;
  }

  // Building sort criteria
  if (sortBy && sortBy.sortField) {
    queryOptions.sort[sortBy.sortField] = sortBy.sortDir === 'asc' ? 1 : -1;
  }

  return queryOptions;
}