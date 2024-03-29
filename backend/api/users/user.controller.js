// User CRUDL API
import { bugService } from '../bug/bug.service.js';
import { userService } from './user.service.js';

// List
export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        const userPromises = users.map(async user => {
            const bugs = await bugService.query({ owner: user._id })
            user.bugsCount = bugs.length
            return user
        })
        const updatedUsers = await Promise.all(userPromises)
        return res.send(updatedUsers)
    } catch (err) {
        res.status(400).send(`Couldn't get users`)
    }
}

// Get
export async function getUser(req, res) {
    const { userId } = req.params
    try {
        const user = await userService.getById(userId)
        const bugs = await bugService.query({ owner: (userId) })
        user.bugsCount = bugs.length
        res.send(user)
    } catch (err) {
        res.status(400).send(`Couldn't get user`)
    }
}


// Delete
export async function removeUser(req, res) {
    const { userId } = req.params

    try {
        await userService.remove(userId, req.loggedinUser)
        res.send(`Successfully removed user with id : ${userId}`)
    } catch (err) {
        res.status(400).send(`Couldn't remove user`)
    }
}


// Save
export async function addUser(req, res) {
    console.log("loggedinUser: ", req.loggedinUser)
    const { username, score, fullname, password } = req.body
    // Better use createUser()
    const userToSave = { username, score: +score, fullname, password }

    try {
        const savedUser = await userService.save(userToSave, req.loggedinUser)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(`Couldn't save user`)
    }
}

// Update
export async function updateUser(req, res) {
    const { _id, username, score, fullname, password = 'sec' } = req.body
    const userToSave = { _id, username, score: +score, fullname, password }
    console.log("userToSave: ", userToSave)

    try {
        const savedUser = await userService.save(userToSave, req.loggedinUser)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(`Couldn't save user`)
    }
}