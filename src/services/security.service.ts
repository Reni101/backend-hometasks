import {sessionsRepository} from "../repositories/sessions/sessions.repository";

export const securityService = {
    async terminateOtherDevices(dto: { deviceId: string, userId: string }) {
        const sessions = await sessionsRepository.getAllSessionsByUserId(dto.userId);
        const sessionForDelete = sessions.filter(el => el.device_id !== dto.deviceId).map(el => el.device_id);
        const result = await sessionsRepository.deleteOtherSession(sessionForDelete);
        return result.deletedCount > 1;
    }
}