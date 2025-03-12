import {Request, Response, Router} from "express";
import {blogsRepository} from "./blogs.repository";
import {InputBlogBody} from "./types";
import {blogInputValidation} from "./blogs.input.validation-middleware";
import {authMiddleware} from "../middleware/authMiddleware";

export const blogsRouter = Router()


const postController = {
    getAllBlogs(_: Request, res: Response,) {
        const blogs = blogsRepository.getAllBlogs()
        res.status(200).json(blogs).end()
        return
    },
    getBlogById(req: Request, res: Response,) {
        const blog = blogsRepository.findBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },
    createBlog(req: Request<{}, {}, InputBlogBody>, res: Response,) {
        const newBlog = blogsRepository.createBlog(req.body)
        res.status(201).json(newBlog).end()
        return
    },
    updateBlog(req: Request<{ id: string }, {}, InputBlogBody>, res: Response,) {
        const isUpdated = blogsRepository.updateBlog(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    deleteBlog(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = blogsRepository.deleteBlog(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}

blogsRouter.get('/', postController.getAllBlogs)
blogsRouter.get('/:id', postController.getBlogById)
blogsRouter.post('/', authMiddleware,blogInputValidation, postController.createBlog)
blogsRouter.put('/:id',authMiddleware, blogInputValidation, postController.updateBlog)
blogsRouter.delete('/:id',authMiddleware, postController.deleteBlog)