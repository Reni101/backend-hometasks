import {Request, Response, Router} from "express";
import {loginInputBody, RegInputBody} from "../common/types/input/auth.types";
import {authService} from "../services/auth.service";
import {loginBodyValidation} from "../middleware/validations/auth.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {usersQueryRepository} from "../repositories/users/users.query.repository";
import {userBodyValidation} from "../middleware/validations/users.input.validation-middleware";
import {ReqWithBody} from "../common/types/requests";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";


export const authRouter = Router()

export const authController = {
    async login(req: ReqWithBody<loginInputBody>, res: Response) {

        const token = await authService.checkCredentials(req.body)
        token ? res.status(200).json({accessToken: token}).end() : res.status(401).end()

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
            res.status(HttpStatuses.BadRequest).json({errorsMessages:result.extensions}).end()
            return
        }
        res.status(HttpStatuses.NoContent).end()
        return
    },
}

authRouter.post('/login', loginBodyValidation, errorsMiddleware, authController.login)
authRouter.get('/me', authBearerMiddleware, errorsMiddleware, authController.me)
authRouter.post('/registration', userBodyValidation, errorsMiddleware, authController.registration)
