import {body} from "express-validator";


const title = body('title').isString().trim().isLength({max: 30})
const shortDescription = body('shortDescription').isString().trim().isLength({max: 100})
const content = body('content').isString().trim().isLength({max: 1000})
const blogId = body('blogId').isString().trim()


export const postInputValidation = [title,shortDescription,content,blogId]