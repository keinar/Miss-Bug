import { loggerService } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";
import { authService } from "../auth/auth.service.js";
import { bugService } from "../bug/bug.service.js";
import { dbService } from "../../services/db.service.js";
import mongodb from 'mongodb'
const { ObjectId } = mongodb
const userCollection = 'user'
const bugCollection = 'bug'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save
}

const TAG = "user.service"

async function query() {

    try {
        const collection = await dbService.getCollection(userCollection)
        const users = await collection.find().toArray()
        return users
    } catch (err) {
        loggerService.error(TAG, `Had problems getting users`, err)
        throw `Had problems getting users`
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(userCollection)
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        delete user.password

        return user
    } catch (err) {
        loggerService.error(TAG, `Had problems getting user`, err)
        throw `Had problems getting user`
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection(userCollection)
        const user = await collection.findOne({ username: username })
        if (user) {
            delete user.password
        }
        return user
    } catch (err) {
        loggerService.error(TAG, `Had problems getting user ${username}`, err)
        throw `Had problems getting user ${username}`
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(userCollection)
        await collection.deleteOne({ _id: new ObjectId(userId) })
        // Find user by ID
    } catch (err) {
        loggerService.error(TAG, `Had problems removing user ${userId}`, err)
        throw `Had problems removing user ${userId}`
    }

    return `User ${userId} removed`
}

async function save(userToSave, loggedinUser) {
    try {
        const collection = await dbService.getCollection(userCollection);
        if (userToSave._id) {
            const userId = new ObjectId(userToSave._id)
            if (!loggedinUser.isAdmin && userId.toString() !== loggedinUser._id.toString()) {
                throw { msg: 'Not your user', code: 403 }
            }
            userToSave._id = userId
        }
        if (!userToSave._id) {
            userToSave.createdAt = Date.now()
            userToSave.isAdmin = false
            userToSave.password = await authService.hashPassword(userToSave.password)
            userToSave.score = Math.floor(Math.random() * 1000) + 1

            if (!userToSave.imgUrl) {
                userToSave.imgUrl = "https://res.cloudinary.com/dn4zdrszh/image/upload/v1708020687/missing-avatar_sowwel.jpg"
            }
        }

        let result;
        if (userToSave._id) {
            result = await collection.updateOne({ _id: userToSave._id }, { $set: userToSave }, { upsert: true });
        } else {
            result = await collection.insertOne(userToSave);
            userToSave._id = result.insertedId;
        }
    } catch (err) {
        loggerService.error(TAG, `Had problems saving user ${userToSave._id}`, err)
        throw `Had problems saving user ${userToSave._id}`
    }

    return userToSave;
}
