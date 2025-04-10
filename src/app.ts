import express from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import {blogsRouter} from "./features/blogs/controller/blogs.controller";
import {postRouter} from "./features/posts/controller/posts.controller";
import {testRouter} from "./test/test.controller";
import {usersRouter} from "./features/users/controller/users.controller";
import {authRouter} from "./features/auth/controller/auth.controller";


export const app = express()
app.use(express.json())
app.use(cors())


app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use( SETTINGS.PATH.POSTS, postRouter)
app.use( SETTINGS.PATH.USERS, usersRouter)
app.use( SETTINGS.PATH.AUTH, authRouter)
app.use( SETTINGS.PATH.TEST, testRouter)