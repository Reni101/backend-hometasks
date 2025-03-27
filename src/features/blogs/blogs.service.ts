import {blogsRepository} from "./blogs.repository";
import {InputBlogBody} from "./types";
import {BlogDbType} from "../../db/types";
import {WithId} from "mongodb";
import {paginationQueries} from "../../helpers/paginationQueries";

export const blogsService = {
    async getAllBlogs(query: ReturnType<typeof paginationQueries>) {
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
        return blogsRepository.updateBlog(dto, id)
    },
    async deleteBlog(id: string) {
        return blogsRepository.deleteBlog(id)
    },
    blogMap({_id, ...rest}: WithId<BlogDbType>) {
        return {id: _id, ...rest}
    }

}