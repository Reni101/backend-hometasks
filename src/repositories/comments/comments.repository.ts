import {commentsCollection} from "../../db/mongo-db";
import {ObjectId} from "mongodb";
import {InputCommentBody} from "../../common/types/input/comments.types";
import {Comment} from "../../entity/comment.entity";
import {injectable} from "inversify";

@injectable()
export class CommentRepository {
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

    async findById(id: string) {
        return commentsCollection.findOne({_id: new ObjectId(id)})

    }

    async updateLikesInfo(dto: { likesCount: number, dislikesCount: number, }, commentId: ObjectId) {
        return commentsCollection.updateOne({_id: commentId}, {
            $set: {'likesInfo.likesCount':dto.likesCount, 'likesInfo.dislikesCount':dto.dislikesCount},
        })
    }


}
