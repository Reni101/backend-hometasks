import {db} from "../../db/db";
import {InputPostBody} from "./types";

export const postsRepository = {
    getAllPosts() {
        return db.posts;
    },
    findPost(id: string) {
        return db.posts.find(el => el.id === id);
    },
    createPost(dto: InputPostBody) {

        // const blog = blogsRepository.findBlog(dto.blogId)
        // if(blog){
        //     const newPost: PostDbType = {
        //         id: uuid(),
        //         title: dto.title,
        //         blogId: dto.blogId,
        //         content: dto.blogId,
        //         shortDescription: dto.shortDescription,
        //         blogName: 'asd',
        //     }
        //     db.posts.push(newPost);
        //     return newPost
        //     return
        // }
        return undefined
    },

    updatePost(dto: InputPostBody, id: string) {
        let isUpdated = false
        // const blog = blogsRepository.findBlog(dto.blogId)
        // const post = db.posts.find(el => el.id === id);
        //
        // if (blog && post) {
        //     post.title = dto.title
        //     post.blogId = dto.blogId
        //     post.shortDescription = dto.shortDescription
        //     post.content = dto.content
        //     post.blogName = blog.name
        //     isUpdated = true
        // }
        return isUpdated
    }
    ,

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