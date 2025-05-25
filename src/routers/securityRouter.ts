import {Router} from "express";
import {deviceId} from "../middleware/validations/devices.input.validation-middleware";
import {errorsMiddleware} from "../middleware/errorsMiddleware";
import {securityController} from "../composition-root";

export const securityRouter = Router()

securityRouter.get('/devices', securityController.getDevices.bind(securityController))
securityRouter.delete('/devices', securityController.terminateOtherDevices.bind(securityController))
securityRouter.delete('/devices/:deviceId', deviceId, errorsMiddleware, securityController.deleteDevice.bind(securityController))
