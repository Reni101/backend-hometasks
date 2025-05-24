import {blogsRepository} from "../repositories/blogs/blogs.repository";
import {InputBlogBody} from "../common/types/input/blogs.types";
import {Blog} from "../entity/blog.entity";

class BlogService {
    async createBlog(dto: InputBlogBody) {

        const newBlog = new Blog(dto.name, dto.description, dto.websiteUrl)

        return blogsRepository.createBlog(newBlog)
    }

    async updateBlog(dto: InputBlogBody, id: string) {
        const result = await blogsRepository.updateBlog(dto, id)
        return result.modifiedCount === 1
    }

    async deleteBlog(id: string) {
        const result = await blogsRepository.deleteBlog(id)
        return result.deletedCount === 1
    }
}

export const blogsService = new BlogService();