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

export type BlogDbType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean,
}

export interface IUserDB extends User {
}

export type CommentsDbType = {
    content: string,
    commentatorInfo: { userId: string, userLogin: string },
    createdAt: Date,
    postId: ObjectId
}

export type RefreshTokenDbType = {
    token: string,
}

export type SessionDbType = {
    user_id: string,
    device_id: string,
    iat: number,
    device_name: string,
    ip: string,
    exp: string,
}