import {ReqWithParams, ReqWithParAndBody} from "../common/types/requests";
import {Request, Response, Router} from "express";
import {commentsQueryRepository} from "../repositories/comments/comments.query.repository";
import {authBearerMiddleware} from "../middleware/auth.bearer.middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {InputCommentBody} from "../common/types/input/comments.types";
import {postContent} from "../middleware/validations/posts.input.validation-middleware";
import {commentsService} from "../services/comments.service";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";

export const commentsRouter = Router()


class CommentsController {
    async getCommentById(req: ReqWithParams<{ id: string }>, res: Response) {
        const comment = await commentsQueryRepository.findComment(req.params.id)
        comment ? res.status(200).json(comment).end() : res.status(404).end()
        return
    }

    async updateComment(req: ReqWithParAndBody<{ id: string }, InputCommentBody>, res: Response,) {
        const result = await commentsService.updateComment(req.body, req.params.id, req.userId!
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
    }

    async deleteComment(req: Request<{ id: string }>, res: Response,) {
        const result = await commentsService.deleteComment(req.params.id, req.userId!)

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

    }
}

const commentsController = new CommentsController()

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))
commentsRouter.put('/:id', authBearerMiddleware, postContent, errorsMiddleware, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:id', authBearerMiddleware, errorsMiddleware, commentsController.deleteComment.bind(commentsController))