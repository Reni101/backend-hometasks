import {Request, Response, Router} from "express";
import {loginInputBody, RegInputBody} from "../common/types/input/auth.types";
import {authService} from "../services/auth.service";
import {loginBodyValidation} from "../middleware/validations/auth.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {usersQueryRepository} from "../repositories/users/users.query.repository";
import {code, email, userBodyValidation} from "../middleware/validations/users.input.validation-middleware";
import {ReqWithBody} from "../common/types/requests";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";
import {rateLimitMiddleware} from "../middleware/rateLimit.middleware";


export const authRouter = Router()

class AuthController {
    async login(req: ReqWithBody<loginInputBody>, res: Response) {
        const ip = req.socket.remoteAddress ?? '';
        const userAgent = req.headers['user-agent'] ?? '';

        const result = await authService.checkCredentials(req.body, ip, userAgent);
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
            const user = await usersQueryRepository.findMeUser(id)
            user && res.status(200).json(user)
            return
        }

        res.status(401).end()
        return
    }

    async registration(req: ReqWithBody<RegInputBody>, res: Response) {
        const result = await authService.registration(req.body)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions}).end()
            return
        }
        res.status(HttpStatuses.NoContent).end()
        return
    }

    async confirmation(req: ReqWithBody<{ code: string }>, res: Response) {
        const result = await authService.confirmation(req.body.code)

        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions})
            return
        }


        res.status(HttpStatuses.NoContent).end()
        return
    }

    async emailResending(req: ReqWithBody<{ email: string }>, res: Response) {
        const result = await authService.emailResending(req.body.email)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions})
        }
        res.status(HttpStatuses.NoContent).end()
        return
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined

        const session = await authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const dto = {userId: session.user_id.toString(), deviceId: session.device_id, sessionId: session._id}
        const result = await authService.refreshToken(dto)

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

        const session = await authService.checkAuthorisation(refreshToken)
        if (!session) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const result = await authService.logout(session._id)

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

const authController = new AuthController()

authRouter.post('/login', rateLimitMiddleware, loginBodyValidation, errorsMiddleware, authController.login.bind(authController))
authRouter.get('/me', authBearerMiddleware, errorsMiddleware, authController.me.bind(authController))
authRouter.post('/registration', rateLimitMiddleware, userBodyValidation, errorsMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', rateLimitMiddleware, code, errorsMiddleware, authController.confirmation.bind(authController))
authRouter.post('/registration-email-resending', rateLimitMiddleware, email, errorsMiddleware, authController.emailResending.bind(authController))
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/logout', authController.logOut)
