import {InputUserBody} from "../common/types/input/users.type";
import {ErrorType} from "../common/types/errors.types";
import {bcryptService} from "../adapters/bcrypt.service";
import {User} from "../entity/user.entity";
import {inject, injectable} from "inversify";
import {UsersRepository} from "../repositories/users/users.repository";

@injectable()
export class UserService {
    constructor(
        @inject(UsersRepository) private usersRepository: UsersRepository,
    ) {

    }

    async createUser(dto: InputUserBody) {

        const existingUser = await this.usersRepository.findUniqueUser(dto);
        if (existingUser) {
            const errorsMessages: ErrorType[] = []
            if (existingUser.login === dto.login) {
                errorsMessages.push({field: 'login', message: 'login exists'})
            }
            if (existingUser.email === dto.email) {
                errorsMessages.push({field: 'email', message: 'email exists'})
            }
            return errorsMessages;
        }

        const passwordHash = await bcryptService.generateHash(dto.password)

        const newUser = new User(dto.login, dto.email, passwordHash)

        return this.usersRepository.createUser(newUser);

    }

    async deleteUser(id: string) {
        const result = await this.usersRepository.deleteUser(id)
        return result.deletedCount === 1
    }
}
