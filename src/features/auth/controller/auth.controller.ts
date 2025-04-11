import {Request, Response, Router} from "express";
import {loginInputBody} from "../types";
import {authService} from "../service/auth.service";
import {loginBodyValidation} from "../middleware/auth.input.validation-middleware";
import {errorsMiddleware} from "../../../middleware/errorsMiddleware";


export const authRouter = Router()

export const authController = {
    async login(req: Request<{}, {}, loginInputBody>, res: Response) {
        const result = await authService.checkCredentials(req.body)
        result ? res.status(204).end() : res.status(401).end()
        return
    }
}

authRouter.post('/login', loginBodyValidation, errorsMiddleware, authController.login)
