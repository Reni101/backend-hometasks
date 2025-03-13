import {body} from "express-validator";

const name = body('name').isString().trim().isLength({max: 15})
const description = body('description').isString().trim().isLength({max: 500})
const websiteUrl = body('websiteUrl').isString().trim().isLength({max: 100}).isURL()

    // .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)


export const blogInputValidation = [name, description, websiteUrl]