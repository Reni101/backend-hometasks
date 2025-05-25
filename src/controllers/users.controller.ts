import {Response} from "express";
import {InputUsersQueryType} from "../common/types/query.types";
import {userQueries} from "../helpers/userQueries";
import {InputUserBody} from "../common/types/input/users.type";
import {ReqWithBody, ReqWithParams, ReqWithQuery} from "../common/types/requests";
import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../repositories/users/users.query.repository";
import {UserService} from "../services/users.service";


@injectable()
export class UsersController {

    constructor(
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
        @inject(UserService) private usersService: UserService,
    ) {

    }

    async getUsers(req: ReqWithQuery<InputUsersQueryType>, res: Response,) {
        const query = userQueries(req)
        const response = await this.usersQueryRepository.getUsers(query)
        res.status(200).json(response).end()
        return
    }

    async createUser(req: ReqWithBody<InputUserBody>, res: Response) {
        const result = await this.usersService.createUser(req.body)
        if (Array.isArray(result)) {
            res.status(400).json({errorsMessages: result}).end()
            return
        }
        const user = await this.usersQueryRepository.findUser(result.insertedId.toString())
        res.status(201).json(user).end()
        return

    }

    async deleteUser(req: ReqWithParams<{ id: string }>, res: Response) {
        const isDeleted = await this.usersService.deleteUser(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}
