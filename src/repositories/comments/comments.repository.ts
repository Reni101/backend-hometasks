import {CommentsDbType} from "../../db/types";
import {commentsCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {InputCommentBody} from "../../common/types/input/comments.types";

export const commentsRepository = {
    async createComment(newComment: CommentsDbType) {
        return commentsCollection.insertOne(newComment);
    },

    async updateComment(dto: InputCommentBody, commentId: string) {
        return commentsCollection.updateOne({_id: new ObjectId(commentId)}, {
            $set: {content: dto.content,},
        })
    },

    async deleteComment(id: string) {
        return commentsCollection.deleteOne({_id: new ObjectId(id)})

    },
}