import {Request, Response, Router} from "express";
import {postsRepository} from "./posts.repository";
import {InputPostBody} from "./types";
import {authMiddleware} from "../../middleware/authMiddleware";
import {errorsMiddleware} from "../../middleware/errorsMiddleware";
import {postInputValidation} from "./posts.input.validation-middleware";

export const postRouter = Router()


const postsController = {
    getAllPosts(_: Request, res: Response,) {
        const posts = postsRepository.getAllPosts();
        res.status(200).json(posts).end()
        return
    },
    getPostById(req: Request, res: Response,) {
        const blog = postsRepository.findPost(req.params.id)
        blog ? res.status(200).json(blog).end() : res.status(404).end()
        return
    },
    createPost(req: Request<{}, {}, InputPostBody>, res: Response,) {
        const newPost = postsRepository.createPost(req.body)
        newPost ? res.status(201).json(newPost).end() : res.status(404).end()
        return
    },
    updateBlog(req: Request<{ id: string }, {}, InputPostBody>, res: Response,) {
        const isUpdated = postsRepository.updatePost(req.body, req.params.id)
        isUpdated ? res.status(204).end() : res.status(404).end();
        return
    },
    deleteBlog(req: Request<{ id: string }>, res: Response,) {
        const isDeleted = postsRepository.deletePost(req.params.id)
        isDeleted ? res.status(204).end() : res.status(404).end()
        return
    }
}


postRouter.get('/', postsController.getAllPosts)
postRouter.get('/:id', postsController.getPostById)
postRouter.post('/', authMiddleware, postInputValidation, errorsMiddleware, postsController.createPost)
postRouter.put('/:id', authMiddleware, postInputValidation, errorsMiddleware, postsController.updateBlog)
postRouter.delete('/:id', authMiddleware, postsController.deleteBlog)