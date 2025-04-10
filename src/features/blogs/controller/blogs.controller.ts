import {Request, Response, Router} from "express";
import {InputBlogBody} from "../types";
import {blogBodyValidation, blogIdParam, blogQueryValidation} from "../middleware/blogs.input.validation-middleware";
import {authMiddleware} from "../../../middleware/authMiddleware";
import {errorsMiddleware} from "../../../middleware/errorsMiddleware";
import {blogsService} from "../service/blogs.service";
import {blogQueries} from "../../../helpers/blogQueries";
import {InputBlogQueryType, InputPostQueryType} from "../../../helpers/types";
import {postsService} from "../../posts/service/post.service";
import {postQueries} from "../../../helpers/postQueries";
import {postBodyValidation, postQueryValidation} from "../../posts/middleware/posts.input.validation-middleware";
import {InputPostBody} from "../../posts/types";
import {blogsQueryRepository} from "../repository/blogs.query.repository";
import {postsQueryRepository} from "../../posts/repository/posts.query.repository";

export const blogsRouter = Router()


const blogsController = {
    async getAllBlogs(req: Request<{}, {}, {}, InputBlogQueryType>, res: Response,) {
        const query = blogQueries(req)
        const response = await blogsQueryRepository.getBlogs(query)
        res.status(200).json(response).end()
        return
    },
    async getBlogById(req: Request<{ id: string }>, res: Response,) {
        const blog = await blogsQueryRepository.findBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },
    async getPostsByBlogId(req: Request<{ blogId: string }, {}, InputPostQueryType>, res: Response,) {
        const {blogId} = req.params
        const query = postQueries(req)
        const result = await postsQueryRepository.getPosts(query, blogId)
        result ? res.status(200).json(result).end() : res.status(404).end()
        return
    },
    async createPostByBlogId(req: Request<{ blogId: string }, {}, Omit<InputPostBody, 'blogId'>>, res: Response,) {
        const {blogId} = req.params
        const dto = {...req.body, blogId}
        const blog = await blogsQueryRepository.findBlog(blogId)
        if (blog) {
            const newPost = await postsService.createPost(dto, blog)
            newPost ? res.status(201).json(newPost).end() : res.status(404).end()
        }
        res.status(404).end()
        return
    },

    async createBlog(req: Request<{}, {}, InputBlogBody>, res: Response,) {
        const result = await blogsService.createBlog(req.body)
        const newBlog = await blogsQueryRepository.findBlog(result.insertedId.toString())
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
blogsRouter.get('/:blogId/posts', blogIdParam, postQueryValidation, errorsMiddleware, blogsController.getPostsByBlogId)
blogsRouter.post('/:blogId/posts', blogIdParam, authMiddleware, postBodyValidation, errorsMiddleware, blogsController.createPostByBlogId)