import {injectable} from "inversify";
import {likeStatus, reactionCommentModel, ReactionCommentType} from "../../db/reactionShema";
import {ObjectId} from "mongodb";

@injectable()
export class ReactionsCommentRepository {
    async findByUserIdAndCommentId(dto: { userId: string, commentId: string }) {
        return reactionCommentModel.findOne({userId: dto.userId, commentId: dto.commentId})
    }

    async createReaction(newReaction: ReactionCommentType) {
        return reactionCommentModel.insertOne(newReaction)
    }

    async deleteReaction(id: ObjectId) {
        return reactionCommentModel.deleteOne({_id: id})
    }

    async updateReaction(dto: { reactionId: ObjectId, status: likeStatus }) {
        return reactionCommentModel.updateOne({_id: dto.reactionId}, {status: dto.status})
    }

    async findReactions(dto: { userId: string, commentsId: string[] }) {
        return reactionCommentModel.find({commentId: {$in: dto.commentsId}, userId: dto.userId}).exec()
    }
}
