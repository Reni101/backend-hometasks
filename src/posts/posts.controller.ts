import {Request, Response, Router} from "express";

export const postRouter = Router()


const postController = {
    getAllPosts(req: Request, res: Response,) {
    }
}

postRouter.get('/', postController.getAllPosts);