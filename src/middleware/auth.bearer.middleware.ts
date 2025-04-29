import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt.service";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if (!auth) {
        res.sendStatus(401).end()
        return
    }

    const [authType, token] = auth.split(' ')

    if (authType !== 'Bearer') {
        res.sendStatus(401).end()
        return
    }
    const payload = await jwtService.verifyToken(token);
    if (payload) {
        req.userId = payload.userId;
        next()
        return
    }

    res.sendStatus(401);
}