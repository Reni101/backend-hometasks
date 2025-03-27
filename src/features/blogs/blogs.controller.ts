import {Request, Response, Router} from "express";
import {InputBlogBody} from "./types";
import {blogBodyValidation, blogQueryValidation} from "./blogs.input.validation-middleware";
import {authMiddleware} from "../../middleware/authMiddleware";
import {errorsMiddleware} from "../../middleware/errorsMiddleware";
import {blogsService} from "./blogs.service";
import {paginationQueries} from "../../helpers/paginationQueries";

export const blogsRouter = Router()


const blogsController = {
    async getAllBlogs(req: Request, res: Response,) {
        const query= paginationQueries(req)

        const response = await blogsService.getAllBlogs(query)
        res.status(200).json(response).end()
        return
    },
    async getBlogById(req: Request, res: Response,) {
        const blog = await blogsService.getBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },
    async createBlog(req: Request<{}, {}, InputBlogBody>, res: Response,) {
        const newBlog = await blogsService.createBlog(req.body)
        res.status(201).json(newBlog).end()
        return
    },
    async updateBlog(req: Request<{ id: string }, {}, InputBlogBody>, res: Response,) {
        const isUpdated = await blogsService.updateBlog(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    async deleteBlog(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = await blogsService.deleteBlog(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}

blogsRouter.get('/',blogQueryValidation, blogsController.getAllBlogs)
blogsRouter.get('/:id', blogsController.getBlogById)
blogsRouter.post('/', authMiddleware, blogBodyValidation, errorsMiddleware, blogsController.createBlog)
blogsRouter.put('/:id', authMiddleware, blogBodyValidation, errorsMiddleware, blogsController.updateBlog)
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog)