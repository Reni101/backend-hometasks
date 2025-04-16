import {Request, Response, Router} from "express";
import {loginInputBody} from "../common/types/input/auth.types";
import {authService} from "../services/auth.service";
import {loginBodyValidation} from "../middleware/validations/auth.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";


export const authRouter = Router()

export const authController = {
    async login(req: Request<{}, {}, loginInputBody>, res: Response) {

        const token = await authService.checkCredentials(req.body)
        token ? res.status(200).json({accessToken: token}).end() : res.status(401).end()

        return
    },
}

authRouter.post('/login', loginBodyValidation, errorsMiddleware, authController.login)
