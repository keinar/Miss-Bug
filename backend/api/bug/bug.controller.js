// Bug CRUDL API
import { bugService } from './bug.service.js';
import { loggerService } from '../../services/logger.service.js';

// List
export async function getBugs(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            severity: +req.query.severity || 0,
            labels: req.query.labels || undefined,
            pageIdx: req.query.pageIdx || undefined
        }
        const sortBy = {
            sortField: req.query.sortBy || '',
            sortDir: +req.query.sortDir || ''
        }
        const bugs = await bugService.query(filterBy, sortBy)
        res.send(bugs)
    } catch (err) {
        res.status(500).send(`Internal Server Error: ${err.message}`)
    }
}

// Get
export async function getBug(req, res) {
    const visitedBugs = req.cookies.visitedBugs || []
    console.log("User visited at the following bugs: ", visitedBugs)
    const { bugId } = req.params
    try {
        const bug = await bugService.getById(bugId)
        if (visitedBugs.length >= 3) {
            res.status(401).send('Wait for a bit')
            return
        }
        if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
        res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })
        res.send(bug)
    } catch (err) {
        res.status(400).send(`Couldn't get bug`)
        loggerService.error(err + 'in get bugs')
    }
}


// Delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        await bugService.remove(bugId)
        res.send(bugId)
    } catch (err) {
        res.status(400).send(`Couldn't remove bug`)
    }
}


// Save
export async function addBug(req, res) {
    const { title, severity, description, labels } = req.body
    // Better use createBug()
    const bugToSave = { title, severity: +severity, description, labels }

    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`)
    }
}

// Update
export async function updateBug(req, res) {
    const { _id, title, severity, description } = req.body
    const bugToSave = { _id, title, severity: +severity, description }
    console.log("bugToSave: ", bugToSave)

    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`)
    }
}