import {body} from "express-validator";


const title = body('title').isString().isLength({max: 30})
const shortDescription = body('shortDescription').isString().isLength({max: 100})
const content = body('content').isString().isLength({max: 1000})
const blogId = body('blogId').isString()


export const postInputValidation = [title,shortDescription,content,blogId]