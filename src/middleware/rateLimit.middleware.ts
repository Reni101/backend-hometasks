import {NextFunction, Request, Response} from "express";
import {RateLimit} from "../entity/rateLimit.entity";
import {rateLimitRepository} from "../repositories/rateLimit/rateLimit.repository";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    const ip = req.socket.remoteAddress ?? '';


    const limits = await rateLimitRepository.getRequests(req.originalUrl, ip);
    if (limits.length > 4) {
        res.status(429).end()
        return
    }

    const rateLimit = new RateLimit({ip, URL: url})
    await rateLimitRepository.addRequest(rateLimit)
    next()
}