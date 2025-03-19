import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {blogCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {blogMapper} from "./blogMapper";

export const blogsRepository = {
    async getAllBlogs() {
        const blogs = await blogCollection.find().toArray()
        return blogs.map(blogMapper);
    },
    async findBlog(id: string) {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})

        return blog ? blogMapper(blog) : undefined

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
        return blog ? blogMapper(blog) : undefined

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
        // const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        // if (!blog) return undefined
        return blogCollection.deleteOne({_id: new ObjectId(id)})
    }
}