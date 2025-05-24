import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../settings";
import {CommentsDbType, IUserDB, PostDbType} from "./types";
import {Session} from "../entity/session.entity";
import {RateLimit} from "../entity/rateLimit.entity";
import {Blog} from "../entity/blog.entity";

const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<Blog> = db.collection<Blog>('blogs')
export const postCollection: Collection<PostDbType> = db.collection<PostDbType>('posts')
export const userCollection: Collection<IUserDB> = db.collection<IUserDB>('users')
export const commentsCollection: Collection<CommentsDbType> = db.collection<CommentsDbType>('comments')
export const sessionsCollection: Collection<Session> = db.collection<Session>('sessions')
export const rateLimitsCollection: Collection<RateLimit> = db.collection<RateLimit>('rateLimit')


export const connectToDB = async () => {
    try {
        await client.connect()
        await db.command({ping: 1})
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}