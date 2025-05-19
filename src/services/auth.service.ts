import {loginInputBody, RegInputBody} from "../common/types/input/auth.types";
import {usersRepository} from "../repositories/users/users.repository";
import {jwtService} from "../adapters/jwt.service";
import {bcryptService} from "../adapters/bcrypt.service";
import {Result} from "../common/result/result.types";
import {User} from "../entity/user.entity";
import {ResultStatus} from "../common/result/resultCode";
import {nodemailerService} from "../adapters/nodemailer.service";
import {randomUUID} from "crypto";
import {add} from "date-fns";
import {sessionsRepository} from "../repositories/sessions/sessions.repository";
import {Session} from "../entity/session.entity";

export const authService = {
    async checkCredentials(dto: loginInputBody, ip: string, userAgent: string) {
        const user = await usersRepository.findByLoginOrEmail(dto.loginOrEmail)
        if (!user) return
        const isCompare = await bcryptService.checkPassword(dto.password, user.passwordHash)

        if (isCompare) {
            const accessToken = await jwtService.createToken({userId: user._id.toString(), expiresIn: '10s'})

            const deviceId = randomUUID()
            const refreshToken = await jwtService.createToken({
                userId: user._id.toString(), expiresIn: '20s', deviceId
            })
            const token = await jwtService.decodeToken(refreshToken)

            if (token) {
                const session = new Session({
                    iat: token.iat!,
                    exp: token.exp!,
                    user_id: user._id.toString(),
                    deviceId: token.deviceId,
                    device_name: userAgent,
                    ip
                })
                await sessionsRepository.addSession(session)
            }
            return {accessToken, refreshToken}
        }
        return isCompare;
    },
    async registration(dto: RegInputBody): Promise<Result> {
        const user = await usersRepository.findUniqueUser({email: dto.email, login: dto.login})
        if (user) {

            let field = ''

            if (user.login === dto.login) field = 'login'
            if (user.email === dto.email) field = 'email'

            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{field: field, message: 'Already Registered'}],
            }
        }
        const passwordHash = await bcryptService.generateHash(dto.password)
        const newUser = new User(dto.login, dto.email, passwordHash)

        await usersRepository.createUser(newUser)
        try {
            await nodemailerService.sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode, 'Registration')
        } catch (e: unknown) {
            console.error('Send email error', e)
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        }
    },
    async confirmation(code: string): Promise<Result> {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [],
            }
        }
        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{field: 'code', message: 'Already Confirmed'}],
            }
        }

        await usersRepository.confirmEmail(user._id.toString())

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        }
    },
    async emailResending(email: string): Promise<Result> {
        const user = await usersRepository.findUserByEmail(email)

        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{message: 'email does not exist', field: 'email'}],
            }
        }
        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{message: 'email confirmed', field: 'email'}],
            }
        }

        const newCode = randomUUID()
        const newDate = add(new Date(), {
            days: 1
        }).toISOString()

        await usersRepository.updateEmailConfirmation(user._id.toString(), newCode, newDate)

        try {
            await nodemailerService.sendEmail(user.email, newCode, "New code")
        } catch (e: unknown) {
            console.error('Send email error', e)
        }
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        }
    },

    async refreshToken(refreshToken: string) {

        const payload = await jwtService.decodeToken(refreshToken) // iat exp
        if (!payload) return
        const session = await sessionsRepository.findSessionByIat(payload.iat!)

        if (!session) return

        const currentTime = Math.floor(Date.now() / 1000)

        if (currentTime > (session.exp)) {
            await sessionsRepository.deleteSession(session._id)
            return
        }
        const {userId, deviceId} = payload
        const newAccessToken = await jwtService.createToken({userId, expiresIn: '10s'})
        const newRefreshToken = await jwtService.createToken({userId, expiresIn: '20s', deviceId})

        const newToken = await jwtService.decodeToken(newRefreshToken)

        await sessionsRepository.updateSession({id: session._id, iat: newToken?.iat!, exp: newToken?.exp!})

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }
    },
    async logout(refreshToken: string) {
        const token = await jwtService.decodeToken(refreshToken)
        const session = await sessionsRepository.findSessionByIat(token?.iat!)
        if (!session) return
        await sessionsRepository.deleteSession(session._id)
        return true

    },
}