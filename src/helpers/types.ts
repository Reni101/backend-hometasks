import {sortDirectionType} from "./sortDirectionType";
import {blogQueries} from "./blogQueries";
import {postQueries} from "./postQueries";
import {userQueries} from "./userQueries";

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
export type InputUsersQueryType = {
    searchLoginTerm?: string |null,
    searchEmailTerm?: string |null,
    sortBy?: string,
    sortDirection?: sortDirectionType
    pageNumber?: number,
    pageSize?: number,
}


export type BlogQueriesType = ReturnType<typeof blogQueries>
export type PostQueriesType = ReturnType<typeof postQueries>
export type UserQueriesType = ReturnType<typeof userQueries>