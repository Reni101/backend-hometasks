import {Request, Response, Router} from "express";
import {
    blogCollection,
    postCollection,
    sessionsCollection,
    userCollection,
    commentsCollection,
    rateLimitsCollection
} from "../db/mongo-db";
import {reactionCommentModel} from "../db/reactionCommentSchema";
import {reactionPostModel} from "../db/reactionPostSchema";

export const testRouter = Router()


export const testController = {

    clearAllData: (req: Request, res: Response) => {
        blogCollection.drop()
        postCollection.drop()
        userCollection.drop()
        commentsCollection.drop()
        sessionsCollection.drop()
        rateLimitsCollection.drop()
        reactionCommentModel.collection.drop()
        reactionPostModel.collection.drop()
        res.status(204).end()

    },


}

testRouter.delete('/all-data', testController.clearAllData)

