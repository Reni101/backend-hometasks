import {loginInputBody} from "../common/types/auth.types";
import {usersRepository} from "../repositories/users/users.repository";
import bcrypt from "bcrypt";

export const authService = {
    async checkCredentials(dto: loginInputBody) {
        const user = await usersRepository.findByLoginOrEmail(dto.loginOrEmail)
        if(!user) return
        return bcrypt.compare(dto.password,user.passHash)
    }
}