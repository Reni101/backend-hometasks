export type PostType = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}


export type dbType = {
    blogs: BlogType[]
    posts: PostType[]
}