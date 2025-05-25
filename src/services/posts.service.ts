import {ObjectId} from "mongodb";
import {InputPostBody} from "../common/types/input/posts.type";
import {Post} from "../entity/post.entity";
import {InputPostByBlogBody} from "../common/types/input/blogs.types";
import {inject, injectable} from "inversify";
import {BlogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {BlogsRepository} from "../repositories/blogs/blogs.repository";
import {PostsRepository} from "../repositories/posts/posts.repository";
import {PostsQueryRepository} from "../repositories/posts/posts.query.repository";

@injectable()
export class PostService {
    constructor(@inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
                @inject(BlogsRepository) private blogsRepository: BlogsRepository,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(PostsRepository) private postsRepository: PostsRepository
    ) {
    }


    async createPost(dto: InputPostBody) {

        const blog = await this.blogsRepository.findBlog(dto.blogId)
        if (!blog) return null
        const newPost = new Post(dto.title, dto.shortDescription, dto.content, new ObjectId(dto.blogId), blog.name)
        const result = await this.postsRepository.createPost(newPost)

        return this.postsQueryRepository.findPost(result.insertedId.toString())

    }

    async updatePost(dto: InputPostBody, postId: string) {
        const blog = await this.blogsQueryRepository.findBlog(dto.blogId)
        const post = await this.postsQueryRepository.findPost(postId)
        if (blog && post) {
            const result = await this.postsRepository.updatePost(dto, postId)
            return result.modifiedCount === 1
        }
        return false
    }

    async deletePost(id: string) {
        const result = await this.postsRepository.deletePost(id)
        return result.deletedCount === 1
    }

    async createPostByBlogId(dto: InputPostByBlogBody & { blogId: string }) {
        const blog = await this.blogsRepository.findBlog(dto.blogId)
        if (!blog) return null
        const newPost = new Post(dto.title, dto.shortDescription, dto.content, new ObjectId(dto.blogId), blog.name)
        const result = await this.postsRepository.createPost(newPost)
        return await this.postsQueryRepository.findPost(result.insertedId.toString())
    }

}
