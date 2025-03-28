import {InputPostBody} from "./types";
import {postCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {PostDbType} from "../../db/types";
import {PostQueriesType} from "../../helpers/types";

export const postsRepository = {
    async getPosts(query: PostQueriesType) {
        return postCollection.find().sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

    },
    async findPost(id: string) {
        return postCollection.findOne({_id: new ObjectId(id)})

    },
    async createPost(newPost: PostDbType) {
        return postCollection.insertOne(newPost);
    },

    async updatePost(dto: InputPostBody, id: string) {
        return postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {...dto}
        })

    },

    async deletePost(id: string) {
        return  postCollection.deleteOne({_id: new ObjectId(id)})

    },
    async getTotalCount() {
        return postCollection.countDocuments({})
    }
}