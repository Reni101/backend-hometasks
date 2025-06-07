import mongoose, {Model, model} from "mongoose";

export type likeStatus = 'None' | "Like" | 'Dislike'

export enum likeStatusEnum {
    'None' = 'None',
    'Like' = 'Like',
    'Dislike' = 'Dislike',
}

export type ReactionCommentType = {
    createdAt: Date,
    status: likeStatus
    userId: string,
    commentId: string

}


export const reactionsCommentSchema = new mongoose.Schema<ReactionCommentType>({
    createdAt: {type: Date, required: true},
    status: {type: String, enum: likeStatusEnum, required: true},
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
});

export const reactionCommentModel = model<ReactionCommentType, Model<ReactionCommentType>>('reactionsComment', reactionsCommentSchema)
