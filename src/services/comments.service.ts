import {ObjectId} from "mongodb";
import {InputCommentBody} from "../common/types/input/comments.types";
import {ResultStatus} from "../common/result/resultCode";
import {Result} from "../common/result/result.types";
import {Comment} from "../entity/comment.entity";
import {PostsQueryRepository} from "../repositories/posts/posts.query.repository";
import {inject, injectable} from "inversify";
import {CommentRepository} from "../repositories/comments/comments.repository";
import {CommentQueryRepository} from "../repositories/comments/comments.query.repository";
import {UsersQueryRepository} from "../repositories/users/users.query.repository";
import {likeStatus, reactionCommentModel} from "../db/reactionShema";
import {ReactionsCommentRepository} from "../repositories/reactions/reactionsCommentRepository";

@injectable()
export class CommentsService {

    constructor(@inject(CommentRepository) private commentsRepository: CommentRepository,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(CommentQueryRepository) private commentsQueryRepository: CommentQueryRepository,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(ReactionsCommentRepository) private reactionsRepository: ReactionsCommentRepository,
    ) {

    }

    async createComment(dto: { content: string, postId: string, userId: string }) {
        const post = await this.postsQueryRepository.findPost(dto.postId)
        if (!post) return null

        const user = await this.usersQueryRepository.findUser(dto.userId);

        if (!user) return

        const commentatorInfo = {userId: user?.id.toString(), userLogin: user.login,}
        const postId = new ObjectId(dto.postId)

        const newComment = new Comment(dto.content, commentatorInfo, postId)

        const result = await this.commentsRepository.createComment(newComment)
        return this.commentsQueryRepository.findComment(result.insertedId.toString())

    }

    async updateComment(dto: InputCommentBody, commentId: string, userId: string): Promise<Result> {
        const comment = await this.commentsQueryRepository.findComment(commentId)
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


        const result = await this.commentsRepository.updateComment(dto, commentId)

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

        const comment = await this.commentsQueryRepository.findComment(commentId)
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
        const result = await this.commentsRepository.deleteComment(commentId)
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

    async like(dto: { commentId: string, userId: string, likeStatus: likeStatus }): Promise<Result> {
        const comment = await this.commentsRepository.findById(dto.commentId)
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: '404',
                extensions: [],
            }
        }

        const reaction = await this.reactionsRepository.findByUserIdAndCommentId({
            commentId: dto.commentId,
            userId: dto.userId,
        })
        if (!reaction && dto.likeStatus === 'None') {
            // нет реакции и приходит статус 'None'=> ошибка 400 поле likeStatus +
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: '400',
                extensions: [{field: 'likeStatus', message: 'no changes'}],
            }
        }

        if (!reaction) {
            //нет реакции приходит статус like/dislike => создаём новую реакцию => обновляем счётчики в комментарии
            const reaction = new reactionCommentModel({
                commentId: dto.commentId,
                userId: dto.userId,
                status: dto.likeStatus,
                createdAt: new Date()
            })
            await this.reactionsRepository.createReaction(reaction)


            const likesInfo = {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount
            }
            if (reaction.status === 'Like') {
                likesInfo.likesCount = comment.likesInfo.likesCount + 1
            } else {
                likesInfo.likesCount = comment.likesInfo.dislikesCount + 1
            }
            await this.commentsRepository.updateLikesInfo(likesInfo, comment._id)

            return {
                status: ResultStatus.Success,
                data: null,
                errorMessage: '204',
                extensions: [],
            }
        } else {
            if (dto?.likeStatus === 'None') {
                // есть реакция и приходит "None" => удаляем реакцию, и в зависимости какой был статус в реакции обновляем счётчики
                const likesInfo = {
                    likesCount: comment.likesInfo.likesCount,
                    dislikesCount: comment.likesInfo.dislikesCount
                }

                if (reaction.status === 'Like') {

                    likesInfo.likesCount = comment.likesInfo.likesCount - 1
                } else {
                    likesInfo.dislikesCount = comment.likesInfo.dislikesCount - 1
                }
                await this.commentsRepository.updateLikesInfo(likesInfo, comment._id)
                await this.reactionsRepository.deleteReaction(reaction?._id)
                return {
                    status: ResultStatus.Success,
                    data: null,
                    errorMessage: '204',
                    extensions: [],
                }
            }
            // есть реакция и приходит like/dislike отличающийся от того что в бд => меняем статус в реакции, обновляем счётчики
            if (dto?.likeStatus !== reaction?.status) {
                await this.reactionsRepository.updateReaction({status: dto.likeStatus, reactionId: reaction._id})
                const likesInfo = {
                    likesCount: comment.likesInfo.likesCount,
                    dislikesCount: comment.likesInfo.dislikesCount
                }

                if (dto.likeStatus === 'Like') {
                    likesInfo.likesCount = comment.likesInfo.likesCount + 1
                    likesInfo.dislikesCount = comment.likesInfo.dislikesCount - 1
                } else {
                    likesInfo.likesCount = comment.likesInfo.likesCount - 1
                    likesInfo.dislikesCount = comment.likesInfo.dislikesCount + 1
                }
                await this.commentsRepository.updateLikesInfo(likesInfo, comment._id)
                return {
                    status: ResultStatus.Success,
                    data: null,
                    errorMessage: '204',
                    extensions: [],
                }
            } else {
                // есть реакция и приходит like/dislike не отличающийся от того что в бд => ошибка 400 поле likeStatus
                return {
                    status: ResultStatus.Success,
                    data: null,
                    errorMessage: '204',
                    extensions: [],
                }
            }

        }

    }

    async reactionStatusToComment(dto: { commentId: string, userId: string }): Promise<likeStatus> {
        const reaction = await this.reactionsRepository.findByUserIdAndCommentId({
            commentId: dto.commentId,
            userId: dto.userId
        })
        if (reaction?.status === 'Like') return 'Like'
        if (reaction?.status === 'Dislike') return 'Dislike'

        return 'None'

    }

    async reactionStatusToComments(dto: { commentsId: string[], userId: string }) {
        const reactions = await this.reactionsRepository.findReactions(dto)
        const reactionsStatus: Record<string, string> = {}
        reactions.forEach((reaction) => {
            reactionsStatus[reaction.commentId] = reaction.status
        })
        return reactionsStatus

    }
}
