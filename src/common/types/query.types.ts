import {blogQueries} from "../../helpers/blogQueries";
import {postQueries} from "../../helpers/postQueries";
import {userQueries} from "../../helpers/userQueries";


export type sortDirectionType = 'asc' | 'desc';

export type PagingSortType = {
    sortBy?: string,
    sortDirection?: sortDirectionType
    pageNumber?: number,
    pageSize?: number,
}


export type InputBlogsQueryType = {
    searchNameTerm?: string | null,
} & PagingSortType

export type InputPostsQueryType = PagingSortType

export type InputUsersQueryType = {
    searchLoginTerm?: string | null,
    searchEmailTerm?: string | null,
} & PagingSortType


export type BlogQueriesType = ReturnType<typeof blogQueries>
export type PostQueriesType = ReturnType<typeof postQueries>
export type UserQueriesType = ReturnType<typeof userQueries>