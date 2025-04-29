import {body} from "express-validator";

const loginOrEmail = body('loginOrEmail').isString().trim().isLength({min: 1})
const password = body('password').isString().trim().isLength({min: 1})

export const loginBodyValidation = [loginOrEmail,password]
