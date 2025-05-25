import {Request, Response} from "express";
import {loginInputBody, RegInputBody} from "../common/types/input/auth.types";
import {ReqWithBody} from "../common/types/requests";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";
import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../repositories/users/users.query.repository";
import {AuthService} from "../services/auth.service";


@injectable()
export class AuthController {
    constructor(
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
        @inject(AuthService) private authService: AuthService,
    ) {

    }
    async login(req: ReqWithBody<loginInputBody>, res: Response) {
        const ip = req.socket.remoteAddress ?? '';
        const userAgent = req.headers['user-agent'] ?? '';

        const result = await this.authService.checkCredentials(req.body, ip, userAgent);
        if (result) {
            res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
            res.status(200).json({accessToken: result.accessToken}).end()
        }

        res.status(401).end()

        return
    }

    async me(req: Request, res: Response) {
        const id = req.userId;
        if (id) {
            const user = await this.usersQueryRepository.findMeUser(id)
            user && res.status(200).json(user)
            return
        }

        res.status(401).end()
        return
    }

    async registration(req: ReqWithBody<RegInputBody>, res: Response) {
        const result = await this.authService.registration(req.body)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions}).end()
            return
        }
        res.status(HttpStatuses.NoContent).end()
        return
    }

    async confirmation(req: ReqWithBody<{ code: string }>, res: Response) {
        const result = await this.authService.confirmation(req.body.code)

        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions})
            return
        }


        res.status(HttpStatuses.NoContent).end()
        return
    }

    async emailResending(req: ReqWithBody<{ email: string }>, res: Response) {
        const result = await this.authService.emailResending(req.body.email)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions})
        }
        res.status(HttpStatuses.NoContent).end()
        return
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await this.authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const dto = {userId: session.user_id.toString(), deviceId: session.device_id, sessionId: session._id}
        const result = await this.authService.refreshToken(dto)

        if (result) {
            res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
            res.status(HttpStatuses.Success).json({accessToken: result.accessToken}).end()
            return
        } else {
            res.clearCookie('refreshToken', {path: '/'});
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
    }

    async logOut(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await this.authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const result = await this.authService.logout(session._id)

        if (result) {
            res.clearCookie('refreshToken', {path: '/'});
            res.status(HttpStatuses.NoContent).end()
            return
        } else {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

    }

}
