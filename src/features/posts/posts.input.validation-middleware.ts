import {body, query} from "express-validator";


const title = body('title').isString().trim().isLength({min: 1, max: 30})
const shortDescription = body('shortDescription').isString().trim().isLength({min: 1, max: 100})
const content = body('content').isString().trim().isLength({min: 1, max: 1000})

const sortBy = query('sortBy').optional().isString().isIn(['title', 'shortDescription', 'content', 'blogName', 'createdAt'])
const sortDirection = query('sortDirection').optional().isString().isIn(['asc', 'desc'])
const pageNumber = query('pageNumber').optional().toInt().isInt({min: 1})
const pageSize = query('pageSize').optional().toInt().isInt({min: 1})

export const postBodyValidation = [title, shortDescription, content,]
export const postQueryValidation = [sortBy, sortDirection, pageNumber, pageSize]