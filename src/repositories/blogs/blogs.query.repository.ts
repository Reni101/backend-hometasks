import {BlogQueriesType} from "../../common/types/query.types";
import {blogCollection} from "../../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {Blog} from "../../entity/blog.entity";
import {injectable} from "inversify";

@injectable()
export class BlogsQueryRepository {
    async getBlogs(query: BlogQueriesType) {
        const filter: any = {}

        if (query.searchNameTerm) {
            filter.name = {$regex: query.searchNameTerm, $options: "i"};
        }
        const blogs = await blogCollection.find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount = await blogCollection.countDocuments(filter)

        return {
            items: blogs.map(this._blogMap),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            pagesCount: Math.ceil(totalCount / query.pageSize)
        };
    }

    async findBlog(id: string) {
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        return blog ? this._blogMap(blog) : undefined

    }

    _blogMap(blog: WithId<Blog>) {
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: blog.isMembership,
            id: blog._id
        }
    }

}
