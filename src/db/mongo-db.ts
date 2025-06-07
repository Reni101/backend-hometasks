import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../settings";
import {Session} from "../entity/session.entity";
import {RateLimit} from "../entity/rateLimit.entity";
import {Blog} from "../entity/blog.entity";
import {User} from "../entity/user.entity";
import {Post} from "../entity/post.entity";
import {Comment} from "../entity/comment.entity";
import mongoose from 'mongoose'


const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<Blog> = db.collection<Blog>('blogs')
export const postCollection: Collection<Post> = db.collection<Post>('posts')
export const userCollection: Collection<User> = db.collection<User>('users')
export const commentsCollection: Collection<Comment> = db.collection<Comment>('comments')
export const sessionsCollection: Collection<Session> = db.collection<Session>('sessions')
export const rateLimitsCollection: Collection<RateLimit> = db.collection<RateLimit>('rateLimit')


const mongoURI = process.env.mongoURI || `mongodb://0.0.0.0:27017`

export const connectToDB = async () => {
    try {
        // await client.connect()
        // await db.command({ping: 1})
        await mongoose.connect(`${mongoURI}/${SETTINGS.DB_NAME}`)
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}