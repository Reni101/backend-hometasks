import {ObjectId} from "mongodb";

export type PostDbType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string
    createdAt:string,
}

export type BlogDbType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt:string,
    isMembership:boolean,
}


export type dbType = {
    blogs: BlogDbType[]
    posts: PostDbType[]
}