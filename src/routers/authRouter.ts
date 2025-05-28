import {Router} from "express";
import {rateLimitMiddleware} from "../middleware/rateLimit.middleware";
import {
    loginBodyValidation,
    newPasswordBodyValidation
} from "../middleware/validations/auth.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {code, email, userBodyValidation} from "../middleware/validations/users.input.validation-middleware";
import {authController} from "../composition-root";

export const authRouter = Router()

authRouter.post('/login', rateLimitMiddleware, loginBodyValidation, errorsMiddleware, authController.login.bind(authController))
authRouter.get('/me', authBearerMiddleware, errorsMiddleware, authController.me.bind(authController))
authRouter.post('/registration', rateLimitMiddleware, userBodyValidation, errorsMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', rateLimitMiddleware, code, errorsMiddleware, authController.confirmation.bind(authController))
authRouter.post('/registration-email-resending', rateLimitMiddleware, email, errorsMiddleware, authController.emailResending.bind(authController))
authRouter.post('/refresh-token', authController.refreshToken.bind(authController))
authRouter.post('/logout', authController.logOut.bind(authController))
authRouter.post('/password-recovery', rateLimitMiddleware, email, errorsMiddleware, authController.passwordRecovery.bind(authController))
authRouter.post('/new-password', rateLimitMiddleware, newPasswordBodyValidation, errorsMiddleware, authController.newPassword.bind(authController))
