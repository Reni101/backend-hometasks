import {Request, Response, Router} from "express";
import {blogsRepository} from "./blogs.repository";

export const blogsRouter = Router()


const postController = {
    getAllBlogs(req: Request, res: Response,) {
        const blogs = blogsRepository.getAllBlogs()
        res.status(200).json(blogs).end()
    }
}

blogsRouter.get('/', postController.getAllBlogs)