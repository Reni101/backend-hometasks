import {ObjectId} from "mongodb";

export class Post {
    createdAt: Date

    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        newestLikes: { addedAt: Date, userId: string, login: string, }[]
    }


    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: ObjectId,
                public blogName: string) {
        this.createdAt = new Date()
        this.extendedLikesInfo = {likesCount: 0, dislikesCount: 0, newestLikes: []};
    }
}