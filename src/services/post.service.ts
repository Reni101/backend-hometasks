import {ObjectId} from "mongodb";
import {PostDbType} from "../db/types";
import {postsRepository} from "../repositories/posts/posts.repository";
import {InputPostBody} from "../common/types/input/posts.type";
import {blogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";
import {Blog} from "../entity/blog.entity";


export const postsService = {
    async createPost(dto: InputPostBody, blog: Blog) {
        const newPost: PostDbType = {
            title: dto.title,
            blogId: new ObjectId(dto.blogId),
            content: dto.blogId,
            shortDescription: dto.shortDescription,
            blogName: blog.name,
            createdAt: new Date()
        }

        return postsRepository.createPost(newPost)
    },

    async updatePost(dto: InputPostBody, postId: string) {
        const blog = await blogsQueryRepository.findBlog(dto.blogId)
        const post = await postsQueryRepository.findPost(postId)
        if (blog && post) {
            const result = await postsRepository.updatePost(dto, postId)
            return result.modifiedCount === 1
        }
        return false
    },
    async deletePost(id: string) {
        const result = await postsRepository.deletePost(id)
        return result.deletedCount === 1
    },

}