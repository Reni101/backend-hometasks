import {db} from "../db/db";

export const blogsRepository = {
    getAllBlogs() {
        return db.blogs;
    },
    findBlog(id: string) {
        return db.blogs.find(el => el.id === id
        );
    }
}