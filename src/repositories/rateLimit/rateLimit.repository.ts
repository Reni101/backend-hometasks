import {rateLimitsCollection} from "../../db/mongo-db";
import {RateLimit} from "../../entity/rateLimit.entity";

export const rateLimitRepository = {
    async addRequest(newRequest: RateLimit) {
        return rateLimitsCollection.insertOne(newRequest);
    },

    async getRequests(url: string) {
        const tenSecondsAgo = new Date(Date.now() - 10000);
        return rateLimitsCollection.find({date: {$gt: tenSecondsAgo}, URL:url}).toArray();
    },

}