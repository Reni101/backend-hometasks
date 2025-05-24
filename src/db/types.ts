import {ObjectId} from "mongodb";
import {User} from "../entity/user.entity";

export type PostDbType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string
    createdAt: Date,
}

export interface IUserDB extends User {
}

export type CommentsDbType = {
    content: string,
    commentatorInfo: { userId: string, userLogin: string },
    createdAt: Date,
    postId: ObjectId
}