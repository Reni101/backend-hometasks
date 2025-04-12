import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../settings";
import {BlogDbType, PostDbType, UserDbType} from "./types";

 const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
export const db: Db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<BlogDbType> = db.collection<BlogDbType>('blogs')
export const postCollection: Collection<PostDbType> = db.collection<PostDbType>('posts')
export const userCollection: Collection<UserDbType> = db.collection<UserDbType>('users')


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