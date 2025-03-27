import {sortDirectionType} from "./sortDirectionType";

export type QueryType = {
    searchNameTerm?: string |null,
    sortBy?: string,
    sortDirection?: sortDirectionType
    pageNumber?: number,
    pageSize?: number,
}