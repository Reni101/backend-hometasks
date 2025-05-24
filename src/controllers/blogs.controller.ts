import {Request, Response, Router} from "express";
import {InputBlogBody, InputPostByBlogBody} from "../common/types/input/blogs.types";
import {
    blogBodyValidation,
    blogIdParam,
    blogQueryValidation
} from "../middleware/validations/blogs.input.validation-middleware";
import {authBasicMiddleware} from "../middleware/auth.basic.middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {blogsService} from "../services/blogs.service";
import {blogQueries} from "../helpers/blogQueries";
import {InputBlogsQueryType, InputPostsQueryType} from "../common/types/query.types";
import {postsService} from "../services/posts.service";
import {postQueries} from "../helpers/postQueries";
import {postBodyValidation, postQueryValidation} from "../middleware/validations/posts.input.validation-middleware";
import {blogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";
import {ReqWithBody, ReqWithParams, ReqWithParAndBody, ReqWithQuery} from "../common/types/requests";
import {blogsRepository} from "../repositories/blogs/blogs.repository";

export const blogsRouter = Router()

class BLogsController {
    async getAllBlogs(req: ReqWithQuery<InputBlogsQueryType>, res: Response,) {
        const query = blogQueries(req)
        const response = await blogsQueryRepository.getBlogs(query)
        res.status(200).json(response).end()
        return
    }

    async getBlogById(req: ReqWithParams<{ id: string }>, res: Response,) {
        const blog = await blogsQueryRepository.findBlog(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    }

    async createBlog(req: ReqWithBody<InputBlogBody>, res: Response,) {
        const result = await blogsService.createBlog(req.body)
        const newBlog = await blogsQueryRepository.findBlog(result.insertedId.toString())
        res.status(201).json(newBlog).end()
        return
    }

    async updateBlog(req: ReqWithParAndBody<{ id: string }, InputBlogBody>, res: Response,) {
        const isUpdated = await blogsService.updateBlog(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    }


    async deleteBlog(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = await blogsService.deleteBlog(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }

    async getPostsByBlogId(req: ReqWithParAndBody<{ blogId: string }, InputPostsQueryType>, res: Response,) {
        const {blogId} = req.params
        const query = postQueries(req)
        const blog = await blogsQueryRepository.findBlog(blogId)
        if (!blog) {
            res.status(404).end()
            return
        }

        const result = await postsQueryRepository.getPosts(query, blogId)
        result ? res.status(200).json(result).end() : res.status(404).end()
        return
    }

    async createPostByBlogId(req: ReqWithParAndBody<{ blogId: string }, InputPostByBlogBody>, res: Response,) {
        const {blogId} = req.params
        const dto = {...req.body, blogId}
        const blog = await blogsRepository.findBlog(blogId)
        if (blog) {
            const result = await postsService.createPost(dto, blog.name)
            const newPost = await postsQueryRepository.findPost(result.insertedId.toString())
            newPost ? res.status(201).json(newPost).end() : res.status(404).end()
        }
        res.status(404).end()
        return
    }
}

const blogsController = new BLogsController()


blogsRouter.get('/', blogQueryValidation, errorsMiddleware, blogsController.getAllBlogs.bind(blogsController))
blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))
blogsRouter.post('/', authBasicMiddleware, blogBodyValidation, errorsMiddleware, blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id', authBasicMiddleware, blogBodyValidation, errorsMiddleware, blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', authBasicMiddleware, blogsController.deleteBlog.bind(blogsController))
blogsRouter.get('/:blogId/posts', blogIdParam, postQueryValidation, errorsMiddleware, blogsController.getPostsByBlogId.bind(blogsController))
blogsRouter.post('/:blogId/posts', blogIdParam, authBasicMiddleware, postBodyValidation, errorsMiddleware, blogsController.createPostByBlogId.bind(blogsController))