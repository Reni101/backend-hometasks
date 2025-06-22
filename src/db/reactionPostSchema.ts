import {likeStatus, likeStatusEnum} from "./reactionCommentSchema";
import mongoose, {Model, model} from "mongoose";

export type ReactionPostType = {
    createdAt: Date,
    status: likeStatus
    userId: string,
    postId: string
    login: string,
}


export const reactionsPostSchema = new mongoose.Schema<ReactionPostType>({
    createdAt: {type: Date, required: true, default: Date.now},
    status: {type: String, enum: likeStatusEnum, required: true},
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    login: {type: String, required: true},
});

export const reactionPostModel = model<ReactionPostType, Model<ReactionPostType>>('reactionsPost', reactionsPostSchema)
