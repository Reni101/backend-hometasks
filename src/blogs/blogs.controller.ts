import {Request, Response, Router} from "express";
import {blogsRepository} from "./blogs.repository";

export const blogsRouter = Router()


const postController = {
    getAllBlogs(req: Request, res: Response,) {
        const blogs = blogsRepository.getAllBlogs()
        res.status(200).json(blogs).end()
        return
    },
    getBlogById(req: Request, res: Response,) {
        const blog = blogsRepository.findBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    }
}

blogsRouter.get('/', postController.getAllBlogs)
blogsRouter.get('/:id', postController.getBlogById)