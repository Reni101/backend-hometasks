import {ObjectId} from "mongodb";

export class Comment {
    createdAt: Date

    constructor(public content: string,
                public commentatorInfo: { userId: string, userLogin: string },
                public postId: ObjectId,
    ) {
        this.createdAt = new Date();
    }
}