import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'
import { requireUser } from '../../middlewares/auth.middleware.js'
import { requireCreator } from './bug.middleware.js'

const router = express.Router()


router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', requireCreator, removeBug)
router.post('/', requireUser, requireCreator, addBug)
router.put('/', requireUser, requireCreator, updateBug)



export const bugRoutes = router