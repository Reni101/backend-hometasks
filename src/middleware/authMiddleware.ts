import {Request, Response, NextFunction} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {


    const auth = req.headers.authorization;

    if (!auth) {
        res.sendStatus(401).end()
        return
    }

    const [authType, token] = auth.split(' ')

    if (authType !== 'Basic') {
        res.sendStatus(401).end()
        return
    }

    const credentials = Buffer.from(auth.slice(6), 'base64').toString('utf8')
    const [username, password] = credentials.split(':')

    if (username !== 'admin' || password !== 'qwerty') {
        res.sendStatus(401).end()
        return
    }
    next()
}