import {ObjectId} from "mongodb";
import {postsRepository} from "../repositories/posts/posts.repository";
import {InputPostBody} from "../common/types/input/posts.type";
import {blogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";
import {Post} from "../entity/post.entity";


class PostService {
    async createPost(dto: InputPostBody, blogName: string) {
        const newPost = new Post(dto.title, dto.shortDescription, dto.content, new ObjectId(dto.blogId), blogName)
        return postsRepository.createPost(newPost)
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
}

export const postsService = new PostService()