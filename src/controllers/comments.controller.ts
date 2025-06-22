import {ReqWithParams, ReqWithParAndBody} from "../common/types/requests";
import {Request, Response} from "express";
import {InputCommentBody} from "../common/types/input/comments.types";
import {ResultStatus} from "../common/result/resultCode";
import {HttpStatuses} from "../common/types/httpStatuses";
import {inject, injectable} from "inversify";
import {CommentQueryRepository} from "../repositories/comments/comments.query.repository";
import {CommentsService} from "../services/comments.service";
import {likeStatus} from "../db/reactionCommentSchema";


@injectable()
export class CommentsController {

    constructor(@inject(CommentsService) private commentsService: CommentsService,
                @inject(CommentQueryRepository) private commentsQueryRepository: CommentQueryRepository,
    ) {

    }


    async getCommentById(req: ReqWithParams<{ id: string }>, res: Response) {

        const comment = await this.commentsQueryRepository.findComment(req.params.id)
        if (req.userId && comment) {

            const reactionStatus = await this.commentsService.reactionStatusToComment({
                commentId: comment.id.toString(),
                userId: req.userId
            })

            comment.likesInfo.myStatus = reactionStatus

        }
        comment ? res.status(200).json(comment).end() : res.status(404).end()
        return
    }

    async updateComment(req: ReqWithParAndBody<{ id: string }, InputCommentBody>, res: Response,) {
        const result = await this.commentsService.updateComment(req.body, req.params.id, req.userId!
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
        const result = await this.commentsService.deleteComment(req.params.id, req.userId!)

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

    async like(req: ReqWithParAndBody<{ commentId: string }, { likeStatus: likeStatus }>, res: Response,) {
        const dto = {commentId: req.params.commentId, userId: req?.userId!, likeStatus: req.body.likeStatus}
        const result = await this.commentsService.like(dto)

        if (result.status === ResultStatus.BadRequest) {
            res.status(HttpStatuses.BadRequest).json({errorsMessages: result}).end()
            return
        }
        if (result.status === ResultStatus.NotFound) {
            res.status(HttpStatuses.NotFound).end()
            return
        }

        res.status(HttpStatuses.NoContent).end();
        return
    }
}
