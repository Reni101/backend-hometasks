import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {blogCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {blogMap} from "./blogMap";

export const blogsRepository = {
    async getAllBlogs() {
        const blogs = await blogCollection.find().toArray()
        return blogs.map(blogMap);
    },
    async findBlog(id: string) {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        return blog ? blogMap(blog) : undefined

    },
    async createBlog(dto: InputBlogBody) {
        const newBlog: BlogDbType = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result = await blogCollection.insertOne(newBlog);
        const blog = await blogCollection.findOne({_id: result.insertedId})
        return blog ? blogMap(blog) : undefined

    },
    async updateBlog(dto: InputBlogBody, id: string) {
        const res = await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl
            }
        });
        return res.modifiedCount === 1
    },
    async deleteBlog(id: string) {
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}