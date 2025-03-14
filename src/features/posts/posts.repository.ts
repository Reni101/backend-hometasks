import {db} from "../../db/db";
import {PostType} from "../../db/types";
import {uuid} from "uuidv4";
import {InputPostBody} from "./types";
import {blogsRepository} from "../blogs/blogs.repository";

export const postsRepository = {
    getAllPosts() {
        return db.posts;
    },
    findPost(id: string) {
        return db.posts.find(el => el.id === id);
    },
    createPost(dto: InputPostBody) {

        const blog = blogsRepository.findBlog(dto.blogId)
        if(blog){
            const newPost: PostType = {
                id: uuid(),
                title: dto.title,
                blogId: dto.blogId,
                content: dto.blogId,
                shortDescription: dto.shortDescription,
                blogName: blog.name,
            }
            db.posts.push(newPost);
            return newPost
        }
        return


    },

    updatePost(dto: InputPostBody, id: string) {
        let isUpdated = false
        const blog = blogsRepository.findBlog(dto.blogId)
        const post = db.posts.find(el => el.id === id);

        if (blog && post) {
            post.title = dto.title
            post.blogId = dto.blogId
            post.shortDescription = dto.shortDescription
            post.content = dto.content
            post.blogName = blog.name
            isUpdated = true
        }
        return isUpdated
    },

    deletePost(id: string) {
        let isDeleted = false

        const index = db.posts.findIndex(el => el.id === id);
        if (index > -1) {
            db.posts.splice(index, 1);
            isDeleted = true
        }
        return isDeleted
    }

}