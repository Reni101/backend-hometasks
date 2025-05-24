import {sessionsRepository} from "../repositories/sessions/sessions.repository";
import {Result} from "../common/result/result.types";
import {ResultStatus} from "../common/result/resultCode";

class SecurityService {
    async terminateOtherDevices(dto: { deviceId: string, userId: string }) {
        const sessions = await sessionsRepository.getAllSessionsByUserId(dto.userId);
        const sessionForDelete = sessions.filter(el => el.device_id !== dto.deviceId).map(el => el._id);
        const result = await sessionsRepository.deleteOtherSession(sessionForDelete);
        return result.deletedCount > 0;
    }

    async terminateDevice(dto: { deviceId: string, userId: string, iat: number }): Promise<Result> {
        const session = await sessionsRepository.findSessionDeviceId(dto.deviceId);
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

        const result = await sessionsRepository.deleteSession(session._id)


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

export const securityService = new SecurityService()