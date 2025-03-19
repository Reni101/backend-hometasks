import {Request, Response, Router} from "express";
import {blogsRepository} from "./blogs.repository";
import {InputBlogBody} from "./types";
import {blogInputValidation} from "./blogs.input.validation-middleware";
import {authMiddleware} from "../../middleware/authMiddleware";
import {errorsMiddleware} from "../../middleware/errorsMiddleware";

export const blogsRouter = Router()


const blogsController = {
    async getAllBlogs(_: Request, res: Response,) {
        const blogs = await blogsRepository.getAllBlogs()
        res.status(200).json(blogs).end()
        return
    },
    async getBlogById(req: Request, res: Response,) {
        const blog = await blogsRepository.findBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },
    async createBlog(req: Request<{}, {}, InputBlogBody>, res: Response,) {
        const newBlog = await blogsRepository.createBlog(req.body)
        res.status(201).json(newBlog).end()
        return
    },
    async updateBlog(req: Request<{ id: string }, {}, InputBlogBody>, res: Response,) {
        const isUpdated = await blogsRepository.updateBlog(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    async deleteBlog(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = await blogsRepository.deleteBlog(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}

blogsRouter.get('/', blogsController.getAllBlogs)
blogsRouter.get('/:id', blogsController.getBlogById)
blogsRouter.post('/', authMiddleware, blogInputValidation, errorsMiddleware, blogsController.createBlog)
blogsRouter.put('/:id', authMiddleware, blogInputValidation, errorsMiddleware, blogsController.updateBlog)
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog)