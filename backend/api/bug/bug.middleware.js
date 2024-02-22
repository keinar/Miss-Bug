
import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"

const TAG = "bug.middleware"

export async function requireCreator(req, res, next) {
    console.log(req.loggedinUser);
    loggerService.debug(req.params?.bugId + " | " + req.body?._id)
    const bugId = req.params?.bugId || req.body?._id
    const bug = await bugService.getById(bugId)
    loggerService.debug(TAG, `${JSON.stringify(bug)}`)
    if (req.loggedinUser._id !== bug.owner._id && !req.loggedinUser.isAdmin) {
        loggerService.warn(TAG, `${req.loggedinUser.username} try to perform not your bug action`)
        return res.status(403).send(`Not authorized`)
    }

    req.bug = bug
    req.loggedinUser = loggedinUser

    next()
}