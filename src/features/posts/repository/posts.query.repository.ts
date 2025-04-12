import {postCollection} from "../../../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {PostQueriesType} from "../../../helpers/queryTypes";
import {PostDbType} from "../../../db/types";

export const postsQueryRepository = {

    async getPosts(query: PostQueriesType, blogId?: string) {
        const filter: any = {}
        if (blogId) {
            filter.blogId = new ObjectId(blogId);
        }

        const posts = await postCollection.find(filter).sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: posts.map(this._postMap),
        }

    },

    async findPost(id: string) {
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        return post ? this._postMap(post) : undefined
    },

    _postMap(post: WithId<PostDbType>) {
        return {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            id: post._id
        }
    }
}