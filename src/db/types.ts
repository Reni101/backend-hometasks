export type PostDbType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type BlogDbType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}


export type dbType = {
    blogs: BlogDbType[]
    posts: PostDbType[]
}