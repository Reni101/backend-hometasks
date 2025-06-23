import {injectable} from "inversify";
import {reactionPostModel, ReactionPostType} from "../../db/reactionPostSchema";
import {likeStatus} from "../../db/reactionCommentSchema";
import {ObjectId} from "mongodb";

@injectable()
export class ReactionPostRepository {
    async findByUserIdAndPostId(dto: { userId: string, postId: string }) {
        return reactionPostModel.findOne({userId: dto.userId, postId: dto.postId})
    }

    async createReaction(newReaction: ReactionPostType) {
        return reactionPostModel.insertOne(newReaction)
    }

    async deleteReaction(id: ObjectId) {
        return reactionPostModel.deleteOne({_id: id})
    }

    async updateReaction(dto: { reactionId: ObjectId, status: likeStatus }) {
        return reactionPostModel.updateOne({_id: dto.reactionId}, {status: dto.status})
    }

    async findReactions(dto: { userId: string, postsId: string[] }) {
        return reactionPostModel.find({postId: {$in: dto.postsId}, userId: dto.userId}).exec()
    }

}