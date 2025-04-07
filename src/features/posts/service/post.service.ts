import {ObjectId} from "mongodb";
import {BlogDbType, PostDbType} from "../../../db/types";
import {postsRepository} from "../repository/posts.repository";
import {InputPostBody} from "../types";
import {blogsQueryRepository} from "../../blogs/repository/blogs.query.repository";
import {postsQueryRepository} from "../repository/posts.query.repository";


export const postsService = {
    async createPost(dto: InputPostBody,blog:BlogDbType) {
            const newPost: PostDbType = {
                title: dto.title,
                blogId: new ObjectId(dto.blogId),
                content: dto.blogId,
                shortDescription: dto.shortDescription,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }

            return postsRepository.createPost(newPost)
    },

    async updatePost(dto: InputPostBody, id: string) {
        const blog = await blogsQueryRepository.findBlog(dto.blogId)
        const post = await postsQueryRepository.findPost(id)
        if (blog && post) {
            const result = await postsRepository.updatePost(dto, id)
            return result.modifiedCount === 1
        }
        return false
    },
    async deletePost(id: string) {
        const result = await postsRepository.deletePost(id)
        return result.deletedCount === 1
    },

}