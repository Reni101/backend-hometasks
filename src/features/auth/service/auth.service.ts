import {loginInputBody} from "../types";
import {usersRepository} from "../../users/repository/users.repository";
import bcrypt from "bcrypt";

export const authService = {
    async checkCredentials(dto: loginInputBody) {
        const user = await usersRepository.findByLoginOrEmail(dto.loginOrEmail)
        if(!user) return
        return bcrypt.compare(dto.password,user.passHash)
    }
}