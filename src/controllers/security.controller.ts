import {Request, Response, Router} from "express";
import {sessionsQueryRepository} from "../repositories/sessions/sessions.query.repository";
import {jwtService} from "../adapters/jwt.service";
import {HttpStatuses} from "../common/types/httpStatuses";
import {securityService} from "../services/security.service";
import {deviceId} from "../middleware/validations/devices.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {ReqWithParams} from "../common/types/requests";
import {ResultStatus} from "../common/result/resultCode";
import {sessionsRepository} from "../repositories/sessions/sessions.repository";

export const securityRouter = Router()

class SecurityController {
    async getDevices(req: Request, res: Response,) {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const token = await jwtService.decodeToken(refreshToken);
        if (!token) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const session = await sessionsRepository.findSessionByIat(token?.iat!, token?.deviceId!)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > (session.exp!)) {
            await sessionsRepository.deleteSession(session._id)
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const devices = await sessionsQueryRepository.getDevices(token.userId)

        res.status(HttpStatuses.Success).json(devices).end()
        return
    }

    async terminateOtherDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const token = await jwtService.decodeToken(refreshToken);
        if (!token) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const session = await sessionsRepository.findSessionByIat(token?.iat!, token?.deviceId!)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > (session.exp!)) {
            await sessionsRepository.deleteSession(session._id)
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        await securityService.terminateOtherDevices({userId: token.userId, deviceId: token.deviceId})
        res.status(HttpStatuses.NoContent).end()
        return
    }

    async deleteDevice(req: ReqWithParams<{ deviceId: string }>, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const token = await jwtService.decodeToken(refreshToken);
        if (!token) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const session = await sessionsRepository.findSessionByIat(token?.iat!, token?.deviceId!)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > (session.exp!)) {
            await sessionsRepository.deleteSession(session._id)
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const result = await securityService.terminateDevice({
            deviceId: req.params.deviceId,
            userId: token.userId,
            iat: token.iat!
        })
        if (result.status === ResultStatus.Forbidden) {
            res.status(HttpStatuses.Forbidden).end()
            return
        }
        if (result.status === ResultStatus.NotFound) {
            res.status(HttpStatuses.NotFound).end()
            return
        }
        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).end()
            return
        }
        res.status(HttpStatuses.NoContent).end()
        return
    }
}

const securityController = new SecurityController()

securityRouter.get('/devices', securityController.getDevices.bind(securityController))
securityRouter.delete('/devices', securityController.terminateOtherDevices.bind(securityController))
securityRouter.delete('/devices/:deviceId', deviceId, errorsMiddleware, securityController.deleteDevice.bind(securityController))
