import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {blogCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {BlogQueriesType} from "../../helpers/types";

export const blogsRepository = {
    async getAllBlogs(query: BlogQueriesType) {
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
        return blogCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {...dto}
        });

    },
    async deleteBlog(id: string) {
        return blogCollection.deleteOne({_id: new ObjectId(id)})

    },
    async getTotalCount(query: BlogQueriesType) {
        const filter: any = {}
        if (query.searchNameTerm) {
            filter.name = {$regex: query.searchNameTerm, $options: "i"};
        }
        return blogCollection.countDocuments(filter)
    }
}