import {Request, Response, Router} from "express";
import {InputPostBody} from "../types";
import {authMiddleware} from "../../../middleware/authMiddleware";
import {errorsMiddleware} from "../../../middleware/errorsMiddleware";
import {postBodyValidation, postQueryValidation} from "../middleware/posts.input.validation-middleware";
import {IInputPostQuery} from "../../../helpers/queryTypes";
import {postQueries} from "../../../helpers/postQueries";
import {postsService} from "../service/post.service";
import {postsQueryRepository} from "../repository/posts.query.repository";
import {blogsQueryRepository} from "../../blogs/repository/blogs.query.repository";

export const postRouter = Router()


const postsController = {
    async getAllPosts(req: Request<{}, {}, {}, IInputPostQuery>, res: Response) {
        const query = postQueries(req)
        const posts = await postsQueryRepository.getPosts(query);
        res.status(200).json(posts).end()
        return
    },
    async getPostById(req: Request<{ id: string }>, res: Response) {
        const blog = await postsQueryRepository.findPost(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },

    async createPost(req: Request<{}, {}, InputPostBody>, res: Response) {
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
    async updatePost(req: Request<{ id: string }, {}, InputPostBody>, res: Response,) {
        const isUpdated = await postsService.updatePost(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    async deletePost(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = await postsService.deletePost(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}


postRouter.get('/', postQueryValidation, errorsMiddleware, postsController.getAllPosts)
postRouter.get('/:id', postsController.getPostById)
postRouter.post('/', authMiddleware, postBodyValidation, errorsMiddleware, postsController.createPost)
postRouter.put('/:id', authMiddleware, postBodyValidation, errorsMiddleware, postsController.updatePost)
postRouter.delete('/:id', authMiddleware, postsController.deletePost)