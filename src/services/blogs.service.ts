import {blogsRepository} from "../repositories/blogs/blogs.repository";
import {InputBlogBody} from "../common/types/blogs.types";
import {BlogDbType} from "../db/types";

export const blogsService = {
    async createBlog(dto: InputBlogBody) {
        const newBlog: BlogDbType = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return blogsRepository.createBlog(newBlog)
    },

    async updateBlog(dto: InputBlogBody, id: string) {
        const result = await blogsRepository.updateBlog(dto, id)
        return result.modifiedCount === 1
    },
    async deleteBlog(id: string) {
        const result = await blogsRepository.deleteBlog(id)
        return result.deletedCount === 1
    },

}