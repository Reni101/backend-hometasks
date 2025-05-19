import {sessionCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {Session} from "../../entity/session.entity";

export const sessionsRepository = {
    async addSession(newSession: Session) {
        return sessionCollection.insertOne(newSession);
    },
    async findSession(iat: number) {
        return sessionCollection.findOne({iat: iat,});
    },
    async findSessionByDeviceId(deviceId: string) {
        return sessionCollection.findOne({device_id: deviceId});
    },
    async updateSession(dto: { iat: number, exp: number, id: ObjectId }) {
        return sessionCollection.updateOne({_id: dto.id}, {
            $set: {iat: dto.iat, exp: dto.exp,}
        });
    },


    async getAllSessionsByUserId(userId: string) {
        return sessionCollection.find({user_id: new ObjectId(userId)}).toArray();
    },
    async deleteSession(id: ObjectId) {
        return sessionCollection.deleteOne({_id: id})
    },
    async deleteOtherSession(ids: ObjectId[]) {
        return sessionCollection.deleteMany({_id: {$in: ids}})
    },
}