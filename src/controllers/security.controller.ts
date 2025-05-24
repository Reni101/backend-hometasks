import {Request, Response, Router} from "express";
import {sessionsQueryRepository} from "../repositories/sessions/sessions.query.repository";
import {HttpStatuses} from "../common/types/httpStatuses";
import {securityService} from "../services/security.service";
import {deviceId} from "../middleware/validations/devices.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {ReqWithParams} from "../common/types/requests";
import {ResultStatus} from "../common/result/resultCode";
import {authService} from "../services/auth.service";

export const securityRouter = Router()

class SecurityController {
    async getDevices(req: Request, res: Response,) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const devices = await sessionsQueryRepository.getDevices(session.user_id.toString())

        res.status(HttpStatuses.Success).json(devices).end()
        return
    }

    async terminateOtherDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const dto = {userId: session.user_id.toString(), deviceId: session.device_id}
        await securityService.terminateOtherDevices(dto)
        res.status(HttpStatuses.NoContent).end()
        return
    }

    async deleteDevice(req: ReqWithParams<{ deviceId: string }>, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const dto = {deviceId: req.params.deviceId, userId: session.user_id.toString(), iat: session.iat}

        const result = await securityService.terminateDevice(dto)

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
