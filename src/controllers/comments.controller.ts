import {ReqWithParams, ReqWithParAndBody} from "../common/types/requests";
import {Response, Router} from "express";
import {commentsQueryRepository} from "../repositories/comments/comments.query.repository";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {InputCommentBody} from "../common/types/input/comments.types";
import {commentId, postContent} from "../middleware/validations/posts.input.validation-middleware";
import {commentsService} from "../services/comments.service";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";

export const commentsRouter = Router()

export const commentsController = {
    async getCommentById(req: ReqWithParams<{ id: string }>, res: Response) {
        const comment = await commentsQueryRepository.findComment(req.params.id)
        comment ? res.status(200).json(comment).end() : res.status(404).end()
        return
    },

    async updateComment(req: ReqWithParAndBody<{ commentId: string }, InputCommentBody>, res: Response,) {
        const result = await commentsService.updateComment(req.body, req.params.commentId, req.userId!
        )
        if (result.status === ResultStatus.Forbidden) {
            res.status(HttpStatuses.Forbidden).end()
            return
        }
        if (result.status === ResultStatus.Success) {
            res.status(HttpStatuses.NoContent).end()
            return
        }
        res.status(HttpStatuses.NotFound).end();
        return
    },
}
commentsRouter.get('/:id', commentsController.getCommentById)
commentsRouter.put('/:commentId', authBearerMiddleware, postContent, commentId, errorsMiddleware, commentsController.updateComment)