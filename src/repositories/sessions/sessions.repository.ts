import {sessionsCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {Session} from "../../entity/session.entity";
import {injectable} from "inversify";

@injectable()
export class SessionsRepository {
    async addSession(newSession: Session) {
        return sessionsCollection.insertOne(newSession);
    }

    async findSessionByIat(iat: number, deviceId: string) {
        return sessionsCollection.findOne({iat: iat, device_id: deviceId});
    }

    async findSessionDeviceId(deviceId: string) {
        return sessionsCollection.findOne({device_id: deviceId});
    }

    async updateSession(dto: { iat: number, exp: number, id: ObjectId }) {
        return sessionsCollection.updateOne({_id: dto.id}, {
            $set: {iat: dto.iat, exp: dto.exp,}
        });
    }

    async getAllSessionsByUserId(userId: string) {
        return sessionsCollection.find({user_id: new ObjectId(userId)}).toArray();
    }

    async deleteSession(id: ObjectId) {
        return sessionsCollection.deleteOne({_id: id})
    }

    async deleteOtherSession(ids: ObjectId[]) {
        return sessionsCollection.deleteMany({_id: {$in: ids}})
    }
}
