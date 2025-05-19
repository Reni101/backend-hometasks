import {Router, Response, Request} from "express";
import {sessionsQueryRepository} from "../repositories/sessions/sessions.query.repository";
import {jwtService} from "../adapters/jwt.service";
import {HttpStatuses} from "../common/types/httpStatuses";
import {securityService} from "../services/security.service";
import {deviceId} from "../middleware/validations/devices.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {ReqWithParams} from "../common/types/requests";
import {ResultStatus} from "../common/result/resultCode";

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
        await securityService.terminateOtherDevices({userId: payload.userId, deviceId: payload.deviceId})
        res.status(HttpStatuses.NoContent).end()
        return
    },
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
        const result = await securityService.terminateDevice({deviceId: req.params.deviceId, userId: token.userId})


        if (result.status === ResultStatus.Forbidden) {
            res.status(HttpStatuses.Forbidden).end()
            return
        }
        if (result.status === ResultStatus.NotFound) {
            res.status(HttpStatuses.NotFound).end()
            return
        }
        res.status(HttpStatuses.NoContent).end()
        return
    }
}

securityRouter.get('/devices', securityController.getDevices)
securityRouter.delete('/devices', securityController.terminateOtherDevices)
securityRouter.delete('/devices/:deviceId', deviceId, errorsMiddleware, securityController.deleteDevice)
