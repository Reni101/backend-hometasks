import {Request, Response, Router} from "express";
import {postsRepository} from "./posts.repository";
import {InputPostBody} from "./types";
import {authMiddleware} from "../../middleware/authMiddleware";
import {errorsMiddleware} from "../../middleware/errorsMiddleware";
import {postInputValidation} from "./posts.input.validation-middleware";

export const postRouter = Router()


const postsController = {
    async getAllPosts(_: Request, res: Response,) {
        const posts = await postsRepository.getAllPosts();
        res.status(200).json(posts).end()
        return
    },
    async getPostById(req: Request, res: Response,) {
        const blog = await postsRepository.findPost(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },
    async createPost(req: Request<{}, {}, InputPostBody>, res: Response,) {
        const newPost = await postsRepository.createPost(req.body)
        newPost ? res.status(201).json(newPost).end() : res.status(404).end()
        return
    },
    async updatePost(req: Request<{ id: string }, {}, InputPostBody>, res: Response,) {
        const isUpdated = await postsRepository.updatePost(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    async  deletePost(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = await postsRepository.deletePost(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}


postRouter.get('/', postsController.getAllPosts)
postRouter.get('/:id', postsController.getPostById)
postRouter.post('/', authMiddleware, postInputValidation, errorsMiddleware, postsController.createPost)
postRouter.put('/:id', authMiddleware, postInputValidation, errorsMiddleware, postsController.updatePost)
postRouter.delete('/:id', authMiddleware, postsController.deletePost)