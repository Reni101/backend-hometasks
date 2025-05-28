import {body} from "express-validator";

const loginOrEmail = body('loginOrEmail').isString().trim().isLength({min: 1})
const password = body('password').isString().trim().isLength({min: 1})

const newPassword = body('newPassword').isString().trim().isLength({min: 6, max: 20})
const recoveryCode = body('recoveryCode').isString().trim().isLength({min: 1})

export const loginBodyValidation = [loginOrEmail, password]

export const newPasswordBodyValidation = [newPassword, recoveryCode]


