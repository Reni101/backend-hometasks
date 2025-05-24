import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/users/users.query.repository";
import {commentsRepository} from "../repositories/comments/comments.repository";
import {commentsQueryRepository} from "../repositories/comments/comments.query.repository";
import {InputCommentBody} from "../common/types/input/comments.types";
import {ResultStatus} from "../common/result/resultCode";
import {Result} from "../common/result/result.types";
import {Comment} from "../entity/comment.entity";
import {postsQueryRepository} from "../repositories/posts/posts.query.repository";


class CommentsService {
    async createComment(dto: { content: string, postId: string, userId: string }) {
        const post = await postsQueryRepository.findPost(dto.postId)
        if (!post) return null

        const user = await usersQueryRepository.findUser(dto.userId);

        if (!user) return

        const commentatorInfo = {userId: user?.id.toString(), userLogin: user.login,}
        const postId = new ObjectId(dto.postId)

        const newComment = new Comment(dto.content, commentatorInfo, postId)

        const result = await commentsRepository.createComment(newComment)
        return commentsQueryRepository.findComment(result.insertedId.toString())

    }

    async updateComment(dto: InputCommentBody, commentId: string, userId: string): Promise<Result> {
        const comment = await commentsQueryRepository.findComment(commentId)
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
            status: ResultStatus.NotFound,
            data: null,
            errorMessage: 'NotFound',
            extensions: [],
        }
    }

    async deleteComment(commentId: string, userId: string): Promise<Result> {

        const comment = await commentsQueryRepository.findComment(commentId)
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
        const result = await commentsRepository.deleteComment(commentId)
        if (result.deletedCount === 1) {
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
            errorMessage: 'BadRequest',
            extensions: [],
        }
    }
}

export const commentsService = new CommentsService()