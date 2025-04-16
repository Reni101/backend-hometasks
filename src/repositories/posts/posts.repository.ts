import {InputPostBody} from "../../common/types/input/posts.type";
import {postCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {PostDbType} from "../../db/types";

export const postsRepository = {
    async createPost(newPost: PostDbType) {
        return postCollection.insertOne(newPost);
    },

    async updatePost(dto: InputPostBody, postId: string) {
        return postCollection.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: new ObjectId(dto.blogId)
            },
        })
    },

    async deletePost(id: string) {
        return postCollection.deleteOne({_id: new ObjectId(id)})

    },
}