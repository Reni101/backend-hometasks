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

@injectable()
export class CommentsService {

    constructor(@inject(CommentRepository) private commentsRepository: CommentRepository,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(CommentQueryRepository) private commentsQueryRepository: CommentQueryRepository,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
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
}