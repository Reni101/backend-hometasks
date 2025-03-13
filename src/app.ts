import express from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import {blogsRouter} from "./features/blogs/blogs.controller";
import {postRouter} from "./features/posts/posts.controller";
import {testRouter} from "./test/testController";


export const app = express()
app.use(express.json())
app.use(cors())


app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.TEST, testRouter)