import {Request, Response, Router} from "express";
import {blogCollection, postCollection} from "../db/mongo-db";

export const testRouter = Router()


export const testController = {

    clearAllData: (req: Request, res: Response) => {
        blogCollection.drop()
        postCollection.drop()
        res.status(204).end()

    },


}

testRouter.delete('/all-data', testController.clearAllData)

