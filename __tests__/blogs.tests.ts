import {MongoClient} from "mongodb";
import {SETTINGS} from "../src/settings";

describe('Blogs', () => {
    const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL);
    beforeAll(async () => {
        await client.connect()
    })

    afterAll(async () => {
        await client.close()
    })

})