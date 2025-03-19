import {InputPostBody} from "./types";
import {postCollection} from "../../db/mongo-db";
import {postMap} from "./postMap";
import {ObjectId} from "mongodb";
import {blogsRepository} from "../blogs/blogs.repository";
import {PostDbType} from "../../db/types";

export const postsRepository = {
    async getAllPosts() {
        const posts = await postCollection.find().toArray()
        return posts.map(postMap);
    },
    async findPost(id: string) {
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        return post ? postMap(post) : undefined
    },
    async createPost(dto: InputPostBody) {
        const blog = await blogsRepository.findBlog(dto.blogId)
        if (blog) {
            const newPost: PostDbType = {
                title: dto.title,
                blogId: dto.blogId,
                content: dto.blogId,
                shortDescription: dto.shortDescription,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }
            const result = await postCollection.insertOne(newPost);
            const post = await postCollection.findOne({_id: result.insertedId})
            return post ? postMap(post) : undefined
        }
        return
    },

    async updatePost(dto: InputPostBody, id: string) {
        let isUpdated = false
        const blog = await blogsRepository.findBlog(dto.blogId)
        const post = await postsRepository.findPost(id)

        if (blog && post) {
            const result = await postCollection.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    title: dto.title,
                    blogId: dto.blogId,
                    content: dto.blogId,
                    shortDescription: dto.shortDescription,
                    blogName: blog.name,
                }
            })
            return result.modifiedCount === 1
        }
        return isUpdated
    },

    async deletePost(id: string) {
        const result = await postCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}