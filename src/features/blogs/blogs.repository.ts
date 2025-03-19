import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {blogCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async getAllBlogs() {
        const blogs = await blogCollection.find().toArray()
        return blogs.map(({_id, ...rest}) => ({id: _id, ...rest}));
    },
    async findBlog(id: string) {
        return blogCollection.findOne({_id: new ObjectId(id)});
    },
    async createBlog(dto: InputBlogBody) {
        const newBlog: BlogDbType = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await blogCollection.insertOne(newBlog);
        return newBlog
    },
    async updateBlog(dto: InputBlogBody, id: string) {
        const res = await blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: dto.name,
                description: dto.description,
                websiteUrl: dto.websiteUrl
            }
        });
        return res.acknowledged
    },
    async deleteBlog(id: string) {
        return blogCollection.deleteOne({_id: new ObjectId(id)})
    }
}