import {tokensCollection} from "../../db/mongo-db";
import {RefreshTokenDbType} from "../../db/types";
import {ObjectId} from "mongodb";

export const tokensRepository = {
    async saveToken(newToken: RefreshTokenDbType) {
        return tokensCollection.insertOne(newToken);
    },
    async findToken(token: string) {
        return tokensCollection.findOne({token: token});
    },

    async deleteToken(id: string) {
        return tokensCollection.deleteOne({_id: new ObjectId(id)})
    },

}