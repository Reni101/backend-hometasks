import {body, query} from "express-validator";

const login = body('login').isString().trim().isLength({min: 3, max: 10}).matches(/^[a-zA-Z0-9_-]*$/)
const password = body('password').isString().trim().isLength({min: 6, max: 20})
const email = body('websiteUrl').isString().trim().isEmail()

const searchLoginTerm = query('searchLoginTerm').optional().isString().trim().isLength({min: 1})
const searchEmailTerm = query('searchEmailTerm').optional().isString().trim().isLength({min: 1})
const sortBy = query('sortBy').optional().isString().isIn(['name', 'description', 'websiteUrl', 'createdAt', 'isMembership'])
const sortDirection = query('sortDirection').optional().isString().isIn(['asc', 'desc'])
const pageNumber = query('pageNumber').optional().toInt().isInt({min: 1})
const pageSize = query('pageSize').optional().toInt().isInt({min: 1})


// export const blogIdParam =param('blogId').isString().isMongoId()

export const userBodyValidation = [login, password, email]
export const userQueryValidation = [searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize]