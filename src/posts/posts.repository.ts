import {db} from "../db/db";

export const postsRepository = {
    getAll() {
        return db.p;
    }
}