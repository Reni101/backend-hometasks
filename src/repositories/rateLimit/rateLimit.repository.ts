import {rateLimitsCollection} from "../../db/mongo-db";
import {RateLimit} from "../../entity/rateLimit.entity";


class RateLimitRepository {
    async addRequest(newRequest: RateLimit) {
        return rateLimitsCollection.insertOne(newRequest);
    }

    async getRequests(url: string, ip: string) {
        const tenSecondsAgo = new Date(Date.now() - 10000);
        return rateLimitsCollection.countDocuments({date: {$gt: tenSecondsAgo}, URL: url, ip});
    }
}

export const rateLimitRepository = new RateLimitRepository();