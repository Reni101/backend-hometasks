import {ObjectId} from "mongodb";

export class Comment {
    createdAt: Date
    likesInfo:{
        likesCount:number,
        dislikesCount:number,
    }

    constructor(public content: string,
                public commentatorInfo: { userId: string, userLogin: string },
                public postId: ObjectId,
    ) {
        this.createdAt = new Date();
        this.likesInfo = {likesCount:0, dislikesCount:0};
    }
}