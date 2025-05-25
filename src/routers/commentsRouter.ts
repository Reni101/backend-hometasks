import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {postContent} from "../middleware/validations/posts.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {commentsController} from "../composition-root";
import {Router} from "express";


export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))
commentsRouter.put('/:id', authBearerMiddleware, postContent, errorsMiddleware, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:id', authBearerMiddleware, errorsMiddleware, commentsController.deleteComment.bind(commentsController))