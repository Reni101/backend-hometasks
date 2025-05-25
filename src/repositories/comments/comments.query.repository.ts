import {commentsCollection} from "../../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {CommentQueriesType} from "../../common/types/query.types";
import {Comment} from "../../entity/comment.entity";
import {injectable} from "inversify";

@injectable()
export class CommentQueryRepository {
    async getComments(query: CommentQueriesType, postId?: string) {
        const filter: any = {}
        if (postId) {
            filter.postId = new ObjectId(postId);
        }

        const posts = await commentsCollection.find(filter).sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount = await commentsCollection.countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: posts.map(this._commentMap),
        }

    }

    async findComment(id: string) {
        const post = await commentsCollection.findOne({_id: new ObjectId(id)})
        return post ? this._commentMap(post) : undefined
    }

    _commentMap(comment: WithId<Comment>) {
        return {
            id: comment._id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt.toISOString(),
        }
    }
}
