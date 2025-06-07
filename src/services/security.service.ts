import {Result} from "../common/result/result.types";
import {ResultStatus} from "../common/result/resultCode";
import {inject, injectable} from "inversify";
import {SessionsRepository} from "../repositories/sessions/sessions.repository";

@injectable()
export class SecurityService {
    constructor(
        @inject(SessionsRepository) private sessionsRepository: SessionsRepository,
    ) {
    }

    async terminateOtherDevices(dto: { deviceId: string, userId: string }) {
        const sessions = await this.sessionsRepository.getAllSessionsByUserId(dto.userId);
        const sessionForDelete = sessions.filter(el => el.device_id !== dto.deviceId).map(el => el._id);
        const result = await this.sessionsRepository.deleteOtherSession(sessionForDelete);
        return result.deletedCount > 0;
    }

    async terminateDevice(dto: { deviceId: string, userId: string, iat: number }): Promise<Result> {
        const session = await this.sessionsRepository.findSessionDeviceId(dto.deviceId);
        if (!session) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'NotFound',
                extensions: [],
            }
        }

        if (session?.user_id.toString() !== dto.userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
                errorMessage: 'Forbidden',
                extensions: [],
            }
        }

        const result = await this.sessionsRepository.deleteSession(session._id)


        if (result?.deletedCount > 0) {
            return {
                status: ResultStatus.Success,
                data: null,
                errorMessage: 'Success',
                extensions: [],
            }
        }

        return {
            status: ResultStatus.NotFound,
            data: null,
            errorMessage: 'NotFound',
            extensions: [],
        }
    }
}
