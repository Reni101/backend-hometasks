import {client} from "../src/db/mongo-db";

describe('Blogs', () => {
    beforeAll(async () => {
        await client.connect()
    })

    afterAll(async () => {
        await client.close()
    })

})