import {Request, Response, Router} from "express";
import {loginInputBody} from "../common/types/input/auth.types";
import {authService} from "../services/auth.service";
import {loginBodyValidation} from "../middleware/validations/auth.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {usersQueryRepository} from "../repositories/users/users.query.repository";


export const authRouter = Router()

export const authController = {
    async login(req: Request<{}, {}, loginInputBody>, res: Response) {

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
}

authRouter.post('/login', loginBodyValidation, errorsMiddleware, authController.login)
authRouter.get('/me', authBearerMiddleware, errorsMiddleware, authController.me)
