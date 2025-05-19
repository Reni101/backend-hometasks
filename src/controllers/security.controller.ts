import {Router, Response, Request} from "express";
import {sessionsQueryRepository} from "../repositories/tokens/sessions.query.repository";
import {jwtService} from "../adapters/jwt.service";
import {HttpStatuses} from "../common/types/httpStatuses";

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
    }
}

securityRouter.get('/devices', securityController.getDevices)
