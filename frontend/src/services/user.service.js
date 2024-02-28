import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:5175/api/'

const BASE_USER_URL = BASE_URL + 'user/'

export const userService = {
    getUsers,
    getById,
    remove,
    saveLocalUser,
    save,
    getLoggedinUser,
    getEmptyUser
}

async function getUsers() {
    try {
        const { data: users } = await axios.get(BASE_USER_URL)
        return users
    } catch (err) {
        console.log("Had problems getting users")
        throw err
    }
}

async function getById(userId) {
    try {
        const { data: user } = await axios.get(BASE_USER_URL + userId)
        return user
    } catch (err) {
        console.log(`Had problems getting user $userId}`)
        throw err
    }
}

async function remove(userId) {
    await axios.delete(BASE_USER_URL + userId)

    // await fetch({method: 'DELETE', url})
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

async function save(userToSave) {
    userToSave._id = userToSave._id || ''

    const method = userToSave._id ? 'put' : 'post'
    const { data: savedUser } = await axios[method](BASE_USER_URL, userToSave)
    return savedUser
}


function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: '',
        score: 0,
    }
}