import {blogsRepository} from "./blogs.repository";
import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {WithId} from "mongodb";
import {BlogQueriesType} from "../../helpers/types";

export const blogsService = {
    async getAllBlogs(query: BlogQueriesType) {
        const blogs = await blogsRepository.getAllBlogs(query)
        const totalCount = await blogsRepository.getTotalCount(query)

        return {
            items: blogs.map(this.blogMap),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            pagesCount: Math.ceil(totalCount / query.pageSize)
        };
    },
    async getBlog(id: string) {
        const blog = await blogsRepository.findBlog(id)
        return blog ? this.blogMap(blog) : undefined
    },

    async createBlog(dto: InputBlogBody) {
        const newBlog: BlogDbType = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const blog = await blogsRepository.createBlog(newBlog)
        return blog ? this.blogMap(blog) : undefined

    },

    async updateBlog(dto: InputBlogBody, id: string) {
        const result = await blogsRepository.updateBlog(dto, id)
        return result.modifiedCount === 1
    },
    async deleteBlog(id: string) {
        const result = await blogsRepository.deleteBlog(id)
        return result.deletedCount === 1
    },
    blogMap({_id, ...rest}: WithId<BlogDbType>) {
        return {id: _id, ...rest}
    }

}