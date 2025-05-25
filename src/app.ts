import express from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";

import {testRouter} from "./controllers/test.controller";
import {usersRouter} from "./controllers/users.controller";
import {authRouter} from "./controllers/auth.controller";
import cookieParser from 'cookie-parser';
import {securityRouter} from "./controllers/security.controller";
import {postRouter} from "./routers/postsRouter";
import {blogsRouter} from "./routers/blogsRouter";
import {commentsRouter} from "./routers/commentsRouter";


export const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.TEST, testRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.SECURITY, securityRouter)