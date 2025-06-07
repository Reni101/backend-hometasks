import {body} from "express-validator";
import {likeStatusEnum} from "../../db/reactionShema";


export const likeStatus = body('likeStatus').isString().trim().isIn(Object.values(likeStatusEnum))

