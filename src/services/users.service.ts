import {InputUserBody} from "../common/types/input/users.type";
import {usersRepository} from "../repositories/users/users.repository";
import {ErrorType} from "../common/types/errors.types";
import {bcryptService} from "../adapters/bcrypt.service";
import {User} from "../entity/user.entity";

export const usersService = {
    async createUser(dto: InputUserBody) {

        const existingUser = await usersRepository.findUniqueUser(dto);
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

        return usersRepository.createUser(newUser);

    },

    async deleteUser(id: string) {
        const result = await usersRepository.deleteUser(id)
        return result.deletedCount === 1
    },
}