import {ObjectId} from "mongodb";
import {postsRepository} from "../repositories/posts/posts.repository";
import {InputPostBody} from "../common/types/input/posts.type";
import {blogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";
import {Post} from "../entity/post.entity";
import {InputPostByBlogBody} from "../common/types/input/blogs.types";
import {BlogsRepository} from "../repositories/blogs/blogs.repository";


class PostService {
    private blogsRepository: BlogsRepository

    constructor() {
        this.blogsRepository = new BlogsRepository();

    }


    async createPost(dto: InputPostBody) {

        const blog = await this.blogsRepository.findBlog(dto.blogId)
        if (!blog) return null
        const newPost = new Post(dto.title, dto.shortDescription, dto.content, new ObjectId(dto.blogId), blog.name)
        const result = await postsRepository.createPost(newPost)

        return postsQueryRepository.findPost(result.insertedId.toString())

    }

    async updatePost(dto: InputPostBody, postId: string) {
        const blog = await blogsQueryRepository.findBlog(dto.blogId)
        const post = await postsQueryRepository.findPost(postId)
        if (blog && post) {
            const result = await postsRepository.updatePost(dto, postId)
            return result.modifiedCount === 1
        }
        return false
    }

    async deletePost(id: string) {
        const result = await postsRepository.deletePost(id)
        return result.deletedCount === 1
    }

    async createPostByBlogId(dto: InputPostByBlogBody & { blogId: string }) {
        const blog = await this.blogsRepository.findBlog(dto.blogId)
        if (!blog) return null
        const newPost = new Post(dto.title, dto.shortDescription, dto.content, new ObjectId(dto.blogId), blog.name)
        const result = await postsRepository.createPost(newPost)
        return await postsQueryRepository.findPost(result.insertedId.toString())
    }

}

export const postsService = new PostService()