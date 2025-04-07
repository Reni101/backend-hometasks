import {BlogQueriesType} from "../../../helpers/types";
import {blogCollection} from "../../../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {BlogDbType} from "../../../db/types";

export const blogsQueryRepository = {
    async getAllBlogs(query: BlogQueriesType) {
        const filter: any = {}

        if (query.searchNameTerm) {
            filter.name = {$regex: query.searchNameTerm, $options: "i"};
        }
        const blogs = await blogCollection.find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount = await this.getTotalCount(query)

        return {
            items: blogs.map(this._blogMap),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            pagesCount: Math.ceil(totalCount / query.pageSize)
        };
    },
    async findBlog(id: string) {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        return blog ? this._blogMap(blog) : undefined

    },

    async getTotalCount(query: BlogQueriesType) {
        const filter: any = {}
        if (query.searchNameTerm) {
            filter.name = {$regex: query.searchNameTerm, $options: "i"};
        }
        return blogCollection.countDocuments(filter)
    },

    _blogMap(blog: WithId<BlogDbType>) {
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            id: blog._id
        }
    }

}