import { authService } from "../api/auth/auth.service.js"
import { loggerService } from "../services/logger.service.js"

export function requireUser(req, res, next) {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    req.loggedinUser = loggedinUser

    next()
}

export function requireAdmin(req, res, next) {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')
    if (!loggedinUser.isAdmin) {
        loggerService.warn(`User ${loggedinUser._id} tried to access admin only endpoint`);
        return res.status(403).send('Not Authorized')
    }

    req.loggedinUser = loggedinUser
    next()
}