import {Request} from "express";
import {InputPostQueryType} from "./types";
import {SortDirection} from "mongodb";

export const postQueries = (req: Request<{}, {}, {}, InputPostQueryType>) => {
    const query = req.query;
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
    }
}