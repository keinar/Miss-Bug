import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/user/'

export const userService = {
    query,
    getById,
    remove,
    save,
    getDefaultFilter
}

async function query(filterBy = {}) {
    var { data: users } = await axios.get(BASE_URL, { params: filterBy })
    return users
}

async function getById(userId) {
    const url = BASE_URL + userId

    var { data: user } = await axios.get(url)
    return user
}

async function remove(userId) {
    const url = BASE_URL + userId
    var { data: res } = await axios.delete(url)
    return res
}

async function save(user) {
    const method = user._id ? 'put' : 'post'
    const { data: savedUser } = await axios[method](BASE_URL, user)
    return savedUser
}

function getDefaultFilter() {
    return { txt: '', score: '', pageIdx: undefined }
}