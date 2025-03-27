import {body, query} from "express-validator";

const name = body('name').isString().trim().isLength({min: 1, max: 15})
const description = body('description').isString().trim().isLength({min: 1, max: 500})
const websiteUrl = body('websiteUrl').isString().trim().isLength({min: 1, max: 100}).isURL()

const searchNameTerm = query('searchNameTerm').optional().isString().trim().isLength({min: 1})
const sortBy = query('sortBy').optional().isString().isIn(['name', 'description','websiteUrl','createdAt','isMembership'])
const sortDirection = query('sortDirection').optional().isString().isIn(['asc', 'desc'])
const pageNumber = query('pageNumber').optional().toInt().isInt({ min: 1 })
const pageSize = query('pageSize').optional().toInt().isInt({ min: 1 })


export const blogBodyValidation = [name, description, websiteUrl]
export const blogQueryValidation = [searchNameTerm,sortBy,sortDirection,pageNumber,pageSize]