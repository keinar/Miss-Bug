import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'
import { requireUser } from '../../middlewares/auth.middleware.js'
import { requireCreator } from './bug.middleware.js'

const router = express.Router()


router.get('/', getBugs) // list
router.get('/:bugId', getBug) // get
router.post('/', requireUser, addBug)   // add
router.put('/', requireUser, requireCreator, updateBug) // update
router.delete('/:bugId', requireUser, requireCreator, removeBug) // delete





export const bugRoutes = router