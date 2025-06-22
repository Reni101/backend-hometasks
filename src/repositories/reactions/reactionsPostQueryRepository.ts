import {injectable} from "inversify";
import {reactionPostModel, ReactionPostType} from "../../db/reactionPostSchema";
import {ObjectId, WithId} from "mongodb";

@injectable()
export class ReactionsPostQueryRepository {
    async findNewReactions(postId: ObjectId) {
        const reactions = await reactionPostModel.find({
            postId: postId,
            status: 'Like'
        }).sort({createdAt: -1}).limit(3).exec()
        return reactions.map(this._map);
    }

    _map(el: WithId<ReactionPostType>) {
        return {addedAt: el.createdAt, userId: el.userId, login: el.login}
    }
}