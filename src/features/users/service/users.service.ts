import {InputUserBody} from "../types";
import bcrypt from "bcrypt";
import {UserDbType} from "../../../db/types";
import {usersRepository} from "../repository/users.repository";
import {ErrorType} from "../../../middleware/types";

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

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(dto.password, salt);

        const newUser: UserDbType = {
            login: dto.login,
            createdAt: new Date().toISOString(),
            email: dto.email,
            passHash: passwordHash,
        }

        return usersRepository.createUser(newUser);

    },

    async _generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
    // bcrypt.compare(password, hash);
}