import {db} from "../db/db";

export const blogsRepository = {
    getAllBlogs() {
        return db.blogs;
    }
}