import {Response, Router} from "express";
import {InputPostBody} from "../common/types/input/posts.type";
import {authBasicMiddleware} from "../middleware/auth.basic.middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {postBodyValidation, postQueryValidation} from "../middleware/validations/posts.input.validation-middleware";
import {InputPostsQueryType} from "../common/types/query.types";
import {postQueries} from "../helpers/postQueries";
import {postsService} from "../services/post.service";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";
import {blogsQueryRepository} from "../repositories/blogs/blogs.query.repository";
import {ReqWithBody, ReqWithParams, ReqWithParAndBody, ReqWithQuery} from "../common/types/requests";

export const postRouter = Router()


const postsController = {
    async getAllPosts(req: ReqWithQuery<InputPostsQueryType>, res: Response) {
        const query = postQueries(req)
        const posts = await postsQueryRepository.getPosts(query);
        res.status(200).json(posts).end()
        return
    },
    async getPostById(req: ReqWithParams<{ id: string }>, res: Response) {
        const blog = await postsQueryRepository.findPost(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },

    async createPost(req: ReqWithBody<InputPostBody>, res: Response) {
        const blog = await blogsQueryRepository.findBlog(req.body.blogId)
        if (blog) {
            const result = await postsService.createPost(req.body, blog)
            const newPost = await postsQueryRepository.findPost(result.insertedId.toString())
            newPost && res.status(201).json(newPost).end()
            return
        }

        res.status(404).end()
        return
    },
    async updatePost(req: ReqWithParAndBody<{ id: string }, InputPostBody>, res: Response,) {
        const isUpdated = await postsService.updatePost(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    async deletePost(req: ReqWithParams<{ id: string }>, res: Response,) {
        const isDeleted = await postsService.deletePost(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}


postRouter.get('/', postQueryValidation, errorsMiddleware, postsController.getAllPosts)
postRouter.get('/:id', postsController.getPostById)
postRouter.post('/', authBasicMiddleware, postBodyValidation, errorsMiddleware, postsController.createPost)
postRouter.put('/:id', authBasicMiddleware, postBodyValidation, errorsMiddleware, postsController.updatePost)
postRouter.delete('/:id', authBasicMiddleware, postsController.deletePost)