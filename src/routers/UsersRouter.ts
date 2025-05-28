import {Router} from "express";
import {
    idParam,
    userBodyValidation,
    userQueryValidation
} from "../middleware/validations/users.input.validation-middleware";
import {authBasicMiddleware} from "../middleware/auth.basic.middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {usersController} from "../composition-root";

export const usersRouter = Router()

usersRouter.get('/', userQueryValidation, authBasicMiddleware, errorsMiddleware, usersController.getUsers.bind(usersController))
usersRouter.post('/', userBodyValidation, authBasicMiddleware, errorsMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', idParam, authBasicMiddleware, errorsMiddleware, usersController.deleteUser.bind(usersController))