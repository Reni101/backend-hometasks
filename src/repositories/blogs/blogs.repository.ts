import {InputBlogBody} from "../../common/types/input/blogs.types";
import {BlogDbType} from "../../db/types";
import {blogCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async createBlog(newBlog: BlogDbType) {
        return blogCollection.insertOne(newBlog);
    },
    async findBlog(id: string) {
        return  await blogCollection.findOne({_id: new ObjectId(id)})

    },

    async updateBlog(dto: InputBlogBody, id: string) {
        return blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {name: dto.name, description: dto.description, websiteUrl: dto.websiteUrl},
        });
    },

    async deleteBlog(id: string) {
        return blogCollection.deleteOne({_id: new ObjectId(id)})
    },

}