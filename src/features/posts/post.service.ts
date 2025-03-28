import {ObjectId, WithId} from "mongodb";
import {PostDbType} from "../../db/types";
import {PostQueriesType} from "../../helpers/types";
import {postsRepository} from "./posts.repository";
import {blogsRepository} from "../blogs/blogs.repository";
import {InputPostBody} from "./types";


export const postsService = {

    async getPosts(query: PostQueriesType) {
        const posts = await postsRepository.getPosts(query)
        const totalCount = await postsRepository.getTotalCount()
        return {
            items: posts.map(this.postMap),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            pagesCount: Math.ceil(totalCount / query.pageSize)
        };
    },
    async getPostsByBlogId(blogId: string, query: PostQueriesType) {
        const blog = await blogsRepository.findBlog(blogId)
        if (blog) {
            const posts = await postsRepository.getPosts(query, blogId)
            const totalCount = await postsRepository.getTotalCount(blogId)

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: posts.map(this.postMap),
            }
        }
        return

    },

    async getPost(id: string) {
        const post = await postsRepository.findPost(id)
        return post ? this.postMap(post) : undefined
    },
    async createPost(dto: InputPostBody) {
        const blog = await blogsRepository.findBlog(dto.blogId)
        if (blog) {
            const newPost: PostDbType = {
                title: dto.title,
                blogId: new ObjectId(dto.blogId),
                content: dto.blogId,
                shortDescription: dto.shortDescription,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }

            const result = await postsRepository.createPost(newPost)
            const post = await postsRepository.findPost(result.insertedId.toString())
            return post ? this.postMap(post) : undefined
        }
        return undefined
    },

    async updatePost(dto: InputPostBody, id: string) {
        const blog = await blogsRepository.findBlog(dto.blogId)
        const post = await postsRepository.findPost(id)
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

    postMap({_id, ...rest}: WithId<PostDbType>) {
        return {id: _id, ...rest}
    }
}