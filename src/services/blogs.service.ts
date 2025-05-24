import {BlogsRepository} from "../repositories/blogs/blogs.repository";
import {InputBlogBody} from "../common/types/input/blogs.types";
import {Blog} from "../entity/blog.entity";

class BlogService {

    private blogsRepository: BlogsRepository;

    constructor() {
        this.blogsRepository = new BlogsRepository();
    }

    async createBlog(dto: InputBlogBody) {
        const newBlog = new Blog(dto.name, dto.description, dto.websiteUrl)
        return this.blogsRepository.createBlog(newBlog)
    }

    async updateBlog(dto: InputBlogBody, id: string) {
        const result = await this.blogsRepository.updateBlog(dto, id)
        return result.modifiedCount === 1
    }

    async deleteBlog(id: string) {
        const result = await this.blogsRepository.deleteBlog(id)
        return result.deletedCount === 1
    }
}

export const blogsService = new BlogService();