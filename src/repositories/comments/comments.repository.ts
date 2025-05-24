import {commentsCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {InputCommentBody} from "../../common/types/input/comments.types";
import {Comment} from "../../entity/comment.entity";


class CommentRepository {
    async createComment(newComment: Comment) {
        return commentsCollection.insertOne(newComment);
    }

    async updateComment(dto: InputCommentBody, commentId: string) {
        return commentsCollection.updateOne({_id: new ObjectId(commentId)}, {
            $set: {content: dto.content,},
        })
    }

    async deleteComment(id: string) {
        return commentsCollection.deleteOne({_id: new ObjectId(id)})

    }
}

export const commentsRepository = new CommentRepository()