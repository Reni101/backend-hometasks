import {Router, Response, Request} from "express";
import {sessionsQueryRepository} from "../repositories/sessions/sessions.query.repository";
import {jwtService} from "../adapters/jwt.service";
import {HttpStatuses} from "../common/types/httpStatuses";
import {securityService} from "../services/security.service";

export const securityRouter = Router()


const securityController = {
    async getDevices(req: Request, res: Response,) {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const payload = await jwtService.decodeToken(refreshToken);
        if (!payload) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const devices = await sessionsQueryRepository.getDevices(payload.userId)
        res.status(HttpStatuses.Success).json(devices).end()
        return
    },
    async terminateOtherDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const payload = await jwtService.decodeToken(refreshToken);
        if (!payload) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const result = await securityService.terminateOtherDevices({userId: payload.userId, deviceId: payload.deviceId})
        result ? res.status(HttpStatuses.NoContent).end() : res.status(HttpStatuses.Unauthorized).end()
    }
}

securityRouter.get('/devices', securityController.getDevices)
securityRouter.delete('/devices', securityController.terminateOtherDevices)
