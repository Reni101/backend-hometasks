import {param} from "express-validator";

export const deviceId = param('deviceId').isString()
