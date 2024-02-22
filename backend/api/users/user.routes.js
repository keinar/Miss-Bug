import express from 'express'
import { addUser, getUser, getUsers, removeUser, updateUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middelware.js'

const router = express.Router()


router.get('/', getUsers)
router.get('/:userId', getUser)
router.delete('/:userId', requireAdmin, removeUser)
router.post('/', addUser)
router.put('/', requireAdmin, updateUser)



export const userRoutes = router