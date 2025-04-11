import {Request, Response, Router} from "express";
import {InputUsersQueryType} from "../../../helpers/types";
import {userQueries} from "../../../helpers/userQueries";
import {usersQueryRepository} from "../repository/users.query.repository";
import {authMiddleware} from "../../../middleware/authMiddleware";
import {errorsMiddleware} from "../../../middleware/errorsMiddleware";
import {idParam, userBodyValidation, userQueryValidation} from "../middleware/users.input.validation-middleware";
import {InputUserBody} from "../types";
import {usersService} from "../service/users.service";

export const usersRouter = Router()

const usersController = {
    async getUsers(req: Request<{}, {}, {}, InputUsersQueryType>, res: Response,) {
        const query = userQueries(req)
        const response = await usersQueryRepository.getUsers(query)
        res.status(200).json(response).end()
        return
    },
    async createUser(req: Request<{}, {}, InputUserBody>, res: Response) {
        const result = await usersService.createUser(req.body)
        if (Array.isArray(result)) {
            res.status(400).json({errorsMessages: result}).end()
            return
        }
        const user = await usersQueryRepository.findUser(result.insertedId.toString())
        res.status(201).json(user).end()
        return

    },
    async deleteUser(req: Request< {id:string}>, res: Response) {
        const isDeleted = await usersService.deleteUser(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}


usersRouter.get('/', userQueryValidation, authMiddleware, errorsMiddleware, usersController.getUsers)
usersRouter.post('/', userBodyValidation, authMiddleware, errorsMiddleware, usersController.createUser)
usersRouter.delete('/:id',idParam,authMiddleware,errorsMiddleware,usersController.deleteUser)