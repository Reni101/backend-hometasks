import {sortDirectionType} from "./sortDirectionType";
import {blogsQueries} from "./blogsQueries";
import {postQueries} from "./postQueries";

export type InputBlogQueryType = {
    searchNameTerm?: string |null,
    sortBy?: string,
    sortDirection?: sortDirectionType
    pageNumber?: number,
    pageSize?: number,
}
export type InputPostQueryType = {
    sortBy?: string,
    sortDirection?: sortDirectionType
    pageNumber?: number,
    pageSize?: number,
}

export type BlogQueriesType = ReturnType<typeof blogsQueries>

export type PostQueriesType = ReturnType<typeof postQueries>