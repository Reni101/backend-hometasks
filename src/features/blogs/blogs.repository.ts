import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {blogCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {paginationQueries} from "../../helpers/paginationQueries";

export const blogsRepository = {
    async getAllBlogs(query: ReturnType<typeof paginationQueries>) {
        const filter: any = {}
        if (query.searchNameTerm) {
            filter.name = {$regex: query.searchNameTerm, $options: "i"};
        }
        return blogCollection.find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()
    },
    async findBlog(id: string) {
        return blogCollection.findOne({_id: new ObjectId(id)})

    },
    async createBlog(newBlog: BlogDbType) {
        const result = await blogCollection.insertOne(newBlog);
        return blogCollection.findOne({_id: result.insertedId})

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
    },
    async getTotalCount(query: ReturnType<typeof paginationQueries>) {
        const filter: any = {}
        if (query.searchNameTerm) {
            filter.name = {$regex: query.searchNameTerm, $options: "i"};
        }
       return  blogCollection.countDocuments(filter)
    }

}