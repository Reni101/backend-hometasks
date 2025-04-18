import {CommentsDbType} from "../db/types";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../repositories/users/users.query.repository";
import {commentsRepository} from "../repositories/comments/comments.repository";

export const commentsService = {
    async createComments(dto: { content: string, postId: string, userId: string }) {
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

        return commentsRepository.createPost(newComment)
    }
}