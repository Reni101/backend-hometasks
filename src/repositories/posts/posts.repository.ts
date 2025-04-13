import {InputPostBody} from "../../common/types/posts.types";
import {postCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {PostDbType} from "../../db/types";

export const postsRepository = {
    async createPost(newPost: PostDbType) {
        return postCollection.insertOne(newPost);
    },

    async updatePost(dto: InputPostBody, id: string) {
        return postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {...dto, blogId: new ObjectId(dto.blogId)},
        })
    },

    async deletePost(id: string) {
        return postCollection.deleteOne({_id: new ObjectId(id)})

    },
}