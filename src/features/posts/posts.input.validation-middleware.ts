import {body} from "express-validator";
import {blogsRepository} from "../blogs/blogs.repository";


const title = body('title').isString().trim().isLength({min: 1, max: 30})
const shortDescription = body('shortDescription').isString().trim().isLength({min: 1,max: 100})
const content = body('content').isString().trim().isLength({min: 1,max: 1000})
const blogId = body('blogId').isString().custom((blogId:string)=>{
    const blog = blogsRepository.findBlog(blogId)
    return !!blog
})

export const postInputValidation = [title, shortDescription, content, blogId]