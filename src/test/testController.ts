import {Request, Response, Router} from "express";
import {db} from "../db/db";

export const testRouter = Router()


export const testController = {

    clearAllData: (req: Request, res: Response) => {
        db.blogs = []
        db.posts = []
        res.status(204).end()

    },


}

testRouter.delete('/all-data', testController.clearAllData)

