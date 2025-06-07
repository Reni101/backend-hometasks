import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt.service";

export const authBearerPassMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (auth) {
        const [authType, token] = auth.split(' ')
        if (authType === 'Bearer') {
            const payload = await jwtService.verifyToken(token)
            if (payload) {
                req.userId = payload.userId;
            }
        }
    }
    next()
}