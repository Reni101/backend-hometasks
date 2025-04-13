import express from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import {blogsRouter} from "./controllers/blogs.controller";
import {postRouter} from "./controllers/posts.controller";
import {testRouter} from "./controllers/test.controller";
import {usersRouter} from "./controllers/users.controller";
import {authRouter} from "./controllers/auth.controller";


export const app = express()
app.use(express.json())
app.use(cors())


app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use( SETTINGS.PATH.POSTS, postRouter)
app.use( SETTINGS.PATH.USERS, usersRouter)
app.use( SETTINGS.PATH.AUTH, authRouter)
app.use( SETTINGS.PATH.TEST, testRouter)