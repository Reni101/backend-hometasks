import {loginInputBody, RegInputBody} from "../common/types/input/auth.types";
import {usersRepository} from "../repositories/users/users.repository";
import {jwtService} from "../adapters/jwt.service";
import {bcryptService} from "../adapters/bcrypt.service";
import {Result} from "../common/result/result.types";
import {User} from "../entity/user.entity";
import {ResultStatus} from "../common/result/resultCode";
import {nodemailerService} from "../adapters/nodemailer.service";

export const authService = {
    async checkCredentials(dto: loginInputBody) {
        const user = await usersRepository.findByLoginOrEmail(dto.loginOrEmail)
        if (!user) return
        const isCompare = await bcryptService.checkPassword(dto.password, user.passwordHash)

        if (isCompare) {
            return jwtService.createToken(user._id.toString())
        }
        return isCompare;
    },
    async registration(dto: RegInputBody): Promise<Result<User | null>> {
        const user = await usersRepository.findUniqueUser({email: dto.email, login: dto.login})
        if (user) return {
            status: ResultStatus.BadRequest,
            errorMessage: 'Bad Request',
            data: null,
            extensions: [{field: 'loginOrEmail', message: 'Already Registered'}],
        }
        const passwordHash = await bcryptService.generateHash(dto.password)
        const newUser = new User(dto.login, dto.email, passwordHash)

        await usersRepository.createUser(newUser)
        try {
            await nodemailerService.sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode)
        } catch (e: unknown) {
            console.error('Send email error', e)
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        }
    },
}