import Axios from 'axios'
import { userService } from './user.service.js'

const axios = Axios.create({
    withCredentials: true,
})

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:5175/api/'

const BASE_AUTH_URL = BASE_URL + 'auth/'

export const authService = {
    login,
    signup,
    logout
}

async function login(credentials) {
    credentials.password = "123456"
    console.log("credentials: " + JSON.stringify(credentials))
    const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
    console.log('user', user);
    if (user) {
        return userService.saveLocalUser(user)
    }
}

async function signup(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
    return userService.saveLocalUser(user)
}

async function logout() {
    await axios.post(BASE_AUTH_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

