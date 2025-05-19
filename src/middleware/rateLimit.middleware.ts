import {NextFunction, Request, Response} from "express";
import {RateLimit} from "../entity/rateLimit.entity";
import {rateLimitRepository} from "../repositories/rateLimit/rateLimit.repository";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    const ip = req.socket.remoteAddress ?? '';

    const rateLimit = new RateLimit({ip, URL: url})
    await rateLimitRepository.addRequest(rateLimit)


    const limits = await rateLimitRepository.getRequests(req.originalUrl);
    if (limits.length >= 10) {
        debugger
        res.status(429).end()
        return
    }

    next()
}