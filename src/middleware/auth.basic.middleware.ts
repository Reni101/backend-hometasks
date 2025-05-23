import {NextFunction, Request, Response} from "express";

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
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

    const credentials = Buffer.from(token, 'base64').toString('utf8')
    const [username, password] = credentials.split(':')
    if (username !== 'admin' || password !== 'qwerty') {
        res.sendStatus(401).end()
        return
    }
    next()
}