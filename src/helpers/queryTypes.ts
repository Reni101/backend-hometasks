import {blogQueries} from "./blogQueries";
import {postQueries} from "./postQueries";
import {userQueries} from "./userQueries";


export type sortDirectionType = 'asc' | 'desc';

export interface IPaging {
    sortBy?: string,
    sortDirection?: sortDirectionType
    pageNumber?: number,
    pageSize?: number,
}

export interface IInputBlogQuery extends IPaging {
    searchNameTerm?: string | null,
}

export interface IInputPostQuery extends IPaging {

}

export interface IInputUsersQuery extends IPaging {
    searchLoginTerm?: string | null,
    searchEmailTerm?: string | null,
}


export type BlogQueriesType = ReturnType<typeof blogQueries>
export type PostQueriesType = ReturnType<typeof postQueries>
export type UserQueriesType = ReturnType<typeof userQueries>