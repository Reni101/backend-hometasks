import {CommentsDbType} from "../db/types";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/users/users.query.repository";
import {commentsRepository} from "../repositories/comments/comments.repository";
import {commentsQueryRepository} from "../repositories/comments/comments.query.repository";
import {InputCommentBody} from "../common/types/input/comments.types";
import {ResultStatus} from "../common/result/resultCode";
import {Result} from "../common/result/result.types";

export const commentsService = {
    async createComment(dto: { content: string, postId: string, userId: string }) {
        const user = await usersQueryRepository.findUser(dto.userId);

        if (!user) {
            return
        }
        const newComment: CommentsDbType = {
            content: dto.content,
            postId: new ObjectId(dto.postId),
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: user?.id.toString(),
                userLogin: user.login,
            }
        }
        return commentsRepository.createComment(newComment)
    },
    async updateComment(dto: InputCommentBody, commentId: string, userId: string): Promise<Result> {
        const comment = await commentsQueryRepository.findComment(commentId)
        debugger
        if (comment) {
            if (comment.commentatorInfo.userId !== userId) {
                return {
                    status: ResultStatus.Forbidden,
                    data: null,
                    errorMessage: 'The comment does not belong to the user',
                    extensions: [],
                }
            }
        }


        const result = await commentsRepository.updateComment(dto, commentId)

        if (result.modifiedCount === 1) {
            return {
                status: ResultStatus.Success,
                data: null,
                errorMessage: 'Success',
                extensions: [],
            }
        }
        return {
            status: ResultStatus.BadRequest,
            data: null,
            errorMessage: 'Success',
            extensions: [],
        }

    }
}