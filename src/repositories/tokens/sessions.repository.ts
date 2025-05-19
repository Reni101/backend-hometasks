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
    async updateSession(dto: { iat: number, exp: number, id: ObjectId }) {
        return sessionCollection.updateOne({_id: dto.id}, {
            $set: {iat: dto.iat, exp: dto.exp,}
        });
    },

    async deleteSession(id: ObjectId) {
        return sessionCollection.deleteOne({_id: id})
    },
}