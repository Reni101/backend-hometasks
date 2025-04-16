import {Response, Router} from "express";
import {InputUsersQueryType} from "../common/types/query.types";
import {userQueries} from "../helpers/userQueries";
import {usersQueryRepository} from "../repositories/users/users.query.repository";
import {authBasicMiddleware} from "../middleware/auth.basic.middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {idParam, userBodyValidation, userQueryValidation} from "../middleware/validations/users.input.validation-middleware";
import {InputUserBody} from "../common/types/input/users.type";
import {usersService} from "../services/users.service";
import {ReqWithBody, ReqWithParams, ReqWithQuery} from "../common/types/requests";

export const usersRouter = Router()

const usersController = {
    async getUsers(req: ReqWithQuery<InputUsersQueryType>, res: Response,) {
        const query = userQueries(req)
        const response = await usersQueryRepository.getUsers(query)
        res.status(200).json(response).end()
        return
    },
    async createUser(req: ReqWithBody<InputUserBody>, res: Response) {
        const result = await usersService.createUser(req.body)
        if (Array.isArray(result)) {
            res.status(400).json({errorsMessages: result}).end()
            return
        }
        const user = await usersQueryRepository.findUser(result.insertedId.toString())
        res.status(201).json(user).end()
        return

    },
    async deleteUser(req: ReqWithParams<{ id: string }>, res: Response) {
        const isDeleted = await usersService.deleteUser(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}


usersRouter.get('/', userQueryValidation, authBasicMiddleware, errorsMiddleware, usersController.getUsers)
usersRouter.post('/', userBodyValidation, authBasicMiddleware, errorsMiddleware, usersController.createUser)
usersRouter.delete('/:id', idParam, authBasicMiddleware, errorsMiddleware, usersController.deleteUser)