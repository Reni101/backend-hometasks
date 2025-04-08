import {Request} from "express";
import {InputUsersQueryType} from "./types";
import {SortDirection} from "mongodb";

export const userQueries = (req: Request<{}, {}, {}, InputUsersQueryType>) => {
    const query = req.query;
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
        searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    }
}