import {Request, Response, Router} from "express";
import {InputBlogBody} from "./types";
import {blogBodyValidation, blogIdParam, blogQueryValidation} from "./blogs.input.validation-middleware";
import {authMiddleware} from "../../middleware/authMiddleware";
import {errorsMiddleware} from "../../middleware/errorsMiddleware";
import {blogsService} from "./blogs.service";
import {blogsQueries} from "../../helpers/blogsQueries";
import {InputBlogQueryType, InputPostQueryType} from "../../helpers/types";
import {postsService} from "../posts/post.service";
import {postQueries} from "../../helpers/postQueries";
import {postBodyValidation, postQueryValidation} from "../posts/posts.input.validation-middleware";
import {InputPostBody} from "../posts/types";

export const blogsRouter = Router()


const blogsController = {
    async getAllBlogs(req: Request<{}, {}, {}, InputBlogQueryType>, res: Response,) {
        const query = blogsQueries(req)
        const response = await blogsService.getAllBlogs(query)
        res.status(200).json(response).end()
        return
    },
    async getBlogById(req: Request<{ id: string }>, res: Response,) {
        const blog = await blogsService.getBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },
    async getPostsByBlogId(req: Request<{ blogId: string }, {}, InputPostQueryType>, res: Response,) {
        const {blogId} = req.params
        const query = postQueries(req)
        const result = await postsService.getPostsByBlogId(blogId, query)
        result ? res.status(200).json(result).end() : res.status(404).end()
        return
    },
    async createPostByBlogId(req: Request<{ blogId: string },{}, Omit<InputPostBody, 'blogId'>>, res: Response,) {
        const {blogId} = req.params
        const dto = {...req.body, blogId}
        const newPost = await postsService.createPost(dto)
        newPost ? res.status(201).json(newPost).end() : res.status(404).end()
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

blogsRouter.get('/', blogQueryValidation, errorsMiddleware, blogsController.getAllBlogs)
blogsRouter.get('/:id', blogsController.getBlogById)
blogsRouter.post('/', authMiddleware, blogBodyValidation, errorsMiddleware, blogsController.createBlog)
blogsRouter.put('/:id', authMiddleware, blogBodyValidation, errorsMiddleware, blogsController.updateBlog)
blogsRouter.delete('/:id', authMiddleware, blogsController.deleteBlog)
blogsRouter.get('/:blogId/posts',blogIdParam,postQueryValidation,errorsMiddleware, blogsController.getPostsByBlogId)
blogsRouter.post('/:blogId/posts',blogIdParam,postBodyValidation,errorsMiddleware, blogsController.createPostByBlogId)