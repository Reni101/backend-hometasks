import {Request, Response} from "express";
import {HttpStatuses} from "../common/types/httpStatuses";
import {ReqWithParams} from "../common/types/requests";
import {ResultStatus} from "../common/result/resultCode";
import {inject, injectable} from "inversify";
import {AuthService} from "../services/auth.service";
import {SecurityService} from "../services/security.service";
import {SessionsQueryRepository} from "../repositories/sessions/sessions.query.repository";


@injectable()
export class SecurityController {

    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(SecurityService) private securityService: SecurityService,
        @inject(SessionsQueryRepository) private sessionsQueryRepository: SessionsQueryRepository,
    ) {

    }

    async getDevices(req: Request, res: Response,) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await this.authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const devices = await this.sessionsQueryRepository.getDevices(session.user_id.toString())

        res.status(HttpStatuses.Success).json(devices).end()
        return
    }

    async terminateOtherDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await this.authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const dto = {userId: session.user_id.toString(), deviceId: session.device_id}
        await this.securityService.terminateOtherDevices(dto)
        res.status(HttpStatuses.NoContent).end()
        return
    }

    async deleteDevice(req: ReqWithParams<{ deviceId: string }>, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await this.authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const dto = {deviceId: req.params.deviceId, userId: session.user_id.toString(), iat: session.iat}

        const result = await this.securityService.terminateDevice(dto)

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


