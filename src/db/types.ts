export type PostDbType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
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