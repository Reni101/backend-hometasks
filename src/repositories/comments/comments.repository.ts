import {CommentsDbType} from "../../db/types";
import {commentsCollection} from "../../db/mongo-db";

export const commentsRepository = {
    async createPost(newComment: CommentsDbType) {
        return commentsCollection.insertOne(newComment);
    },
    //
    // async updatePost(dto: InputPostBody, postId: string) {
    //     return postCollection.updateOne({_id: new ObjectId(postId)}, {
    //         $set: {
    //             title: dto.title,
    //             shortDescription: dto.shortDescription,
    //             content: dto.content,
    //             blogId: new ObjectId(dto.blogId)
    //         },
    //     })
    // },
    //
    // async deletePost(id: string) {
    //     return postCollection.deleteOne({_id: new ObjectId(id)})
    //
    // },
}