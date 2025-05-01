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


export const authRouter = Router()

export const authController = {
    async login(req: ReqWithBody<loginInputBody>, res: Response) {

        const result = await authService.checkCredentials(req.body)
        if (result) {
            res.cookie('refreshToken', result.refreshToken, {httpOnly: false, secure: false})
            res.status(200).json({accessToken: result.accessToken}).end()
        }

        res.status(401).end()

        return
    },
    async me(req: Request, res: Response) {
        const id = req.userId;
        if (id) {
            const user = await usersQueryRepository.findMeUser(id)
            user && res.status(200).json(user)
            return
        }

        res.status(401).end()
        return
    },
    async registration(req: ReqWithBody<RegInputBody>, res: Response) {
        const result = await authService.registration(req.body)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions}).end()
            return
        }
        res.status(HttpStatuses.NoContent).end()
        return
    },
    async confirmation(req: ReqWithBody<{ code: string }>, res: Response) {
        const result = await authService.confirmation(req.body.code)

        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions})
            return
        }


        res.status(HttpStatuses.NoContent).end()
        return
    },

    async emailResending(req: ReqWithBody<{ email: string }>, res: Response) {
        const result = await authService.emailResending(req.body.email)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result.extensions})
        }
        res.status(HttpStatuses.NoContent).end()
        return
    },
    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        const result = await authService.refreshToken(refreshToken)
        if (!result) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }
        res.cookie('refreshToken', result.refreshToken, {httpOnly: false, secure: false})
        res.status(HttpStatuses.Success).end().json({accessToken: result.accessToken})
        return
    },
    async logOut(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) {
            res.status(HttpStatuses.Unauthorized).end()
            return
        }

        const result = await authService.logout(req.body.code)
        result ? res.status(HttpStatuses.Success).end() : res.status(HttpStatuses.Unauthorized).end()

        return
    },
}

authRouter.post('/login', loginBodyValidation, errorsMiddleware, authController.login)
authRouter.get('/me', authBearerMiddleware, errorsMiddleware, authController.me)
authRouter.post('/registration', userBodyValidation, errorsMiddleware, authController.registration)
authRouter.post('/registration-confirmation', code, errorsMiddleware, authController.confirmation)
authRouter.post('/registration-email-resending', email, errorsMiddleware, authController.emailResending)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/logout', authController.logOut)
