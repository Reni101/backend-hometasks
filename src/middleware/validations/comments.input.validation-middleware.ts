import {body} from "express-validator";
import {likeStatusEnum} from "../../db/reactionCommentSchema";


export const likeStatus = body('likeStatus').isString().trim().isIn(Object.values(likeStatusEnum))

