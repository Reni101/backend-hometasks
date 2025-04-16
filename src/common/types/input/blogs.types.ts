import {InputPostBody} from "./posts.type";

export type InputBlogBody = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type InputPostByBlogBody = Omit<InputPostBody, 'blogId'>