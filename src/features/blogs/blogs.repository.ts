import {db} from "../../db/db";
import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {uuid} from "uuidv4";
import {blogCollection} from "../../db/mongo-db";

export const blogsRepository = {
    async getAllBlogs() {
        return await blogCollection.find().toArray();
    },
    findBlog(id: string) {
        return db.blogs.find(el => el.id === id
        );
    },
    async createBlog(dto: InputBlogBody) {
        const newBlog: BlogDbType = {
            id: uuid(),
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl
        }
        await blogCollection.insertOne(newBlog);
        // db.blogs.push(newBlog);
        return newBlog
    },
    updateBlog(dto: InputBlogBody, id: string) {
        let isUpdated = false

        const blog = db.blogs.find(el => el.id === id);

        if (blog) {
            blog.name = dto.name;
            blog.description = dto.description;
            blog.websiteUrl = dto.websiteUrl;
            isUpdated = true
        }
        return isUpdated
    },
    deleteBlog(id: string) {
        let isDeleted = false

        const index = db.blogs.findIndex(el => el.id === id);
        if (index > -1) {
            db.blogs.splice(index, 1);
            isDeleted = true
        }
        return isDeleted
    }
}