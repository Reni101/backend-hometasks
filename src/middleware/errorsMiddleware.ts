import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

export const errorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const e = validationResult(req)
    if (!e.isEmpty()) {
        const eArray = e.array() as { path: string, msg: string }[]

        res.status(400).json({
            errorsMessages: eArray.map(x => ({field: x.path, message: x.msg}))
        })

        return
    }

    next()
}