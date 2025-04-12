import {IInputPostQuery} from "./queryTypes";
import {SortDirection} from "mongodb";
import {ReqWithQuery} from "../common/types/requests";

export const postQueries = (req: ReqWithQuery<IInputPostQuery>) => {
    const query = req.query;
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
    }
}