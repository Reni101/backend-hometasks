import {Router} from "express";
import {
    commentsQueryValidation,
    postBodyValidation,
    postContent,
    postQueryValidation
} from "../middleware/validations/posts.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {authBasicMiddleware} from "../middleware/auth.basic.middleware";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {postsController} from "../composition-root";

export const postRouter = Router()
postRouter.get('/', postQueryValidation, errorsMiddleware, postsController.getAllPosts.bind(postsController))
postRouter.get('/:id', postsController.getPostById)
postRouter.post('/', authBasicMiddleware, postBodyValidation, errorsMiddleware, postsController.createPost.bind(postsController))
postRouter.put('/:id', authBasicMiddleware, postBodyValidation, errorsMiddleware, postsController.updatePost.bind(postsController))
postRouter.delete('/:id', authBasicMiddleware, postsController.deletePost.bind(postsController))
postRouter.get('/:postId/comments', commentsQueryValidation, errorsMiddleware, postsController.getCommentsByPostId.bind(postsController))
postRouter.post('/:postId/comments', authBearerMiddleware, postContent, errorsMiddleware, postsController.createCommentByPostId.bind(postsController))

