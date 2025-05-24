import {sessionsCollection} from "../../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {Session} from "../../entity/session.entity";


class SessionsQueryRepository {
    async getDevices(userId: string) {
        const devices = await sessionsCollection.find({user_id: new ObjectId(userId)})
            .toArray();
        return devices.map(this._sessionsMap);

    }

    _sessionsMap(session: WithId<Session>) {
        return {
            ip: session.ip,
            title: session.device_name,
            lastActiveDate: new Date(session.iat).toISOString(),
            deviceId: session.device_id,
        }
    }
}

export const sessionsQueryRepository = new SessionsQueryRepository()