import {InputPostBody} from "./posts.types";

export type InputBlogBody = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type InputPostByBlogBody = Omit<InputPostBody, 'blogId'>