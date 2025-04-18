import {commentsCollection} from "../../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {CommentQueriesType} from "../../common/types/query.types";
import {CommentsDbType} from "../../db/types";

export const commentsQueryRepository = {
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
            items: posts.map(this._postMap),
        }

    },
    //
    // async findPost(id: string) {
    //     const post = await postCollection.findOne({_id: new ObjectId(id)})
    //     return post ? this._postMap(post) : undefined
    // },
    //
    _postMap(comment: WithId<CommentsDbType>) {
        return {
            id:comment._id,
            content:comment.content,
            commentatorInfo:comment.commentatorInfo,
            createdAt: comment.createdAt,
        }
    }
}