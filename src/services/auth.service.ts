import {loginInputBody} from "../common/types/input/auth.types";
import {usersRepository} from "../repositories/users/users.repository";
import bcrypt from "bcrypt";
import {jwtService} from "../applications/jwt.service";

export const authService = {
    async checkCredentials(dto: loginInputBody) {
        const user = await usersRepository.findByLoginOrEmail(dto.loginOrEmail)
        if (!user) return
        const isCompare = await bcrypt.compare(dto.password, user.passHash)

        if (isCompare) {
            return  jwtService.createToken(user._id.toString())
        }
        return isCompare;
    }
}