import {ObjectId} from "mongodb";

export class Session {
    user_id: ObjectId;
    device_id: string;
    device_name: string;
    ip: string
    exp: number;
    iat: number;


    constructor(dto: { user_id: string, device_name: string, ip: string, exp: number, iat: number, deviceId: string }) {
        this.user_id = new ObjectId(dto.user_id);
        this.device_id = dto.deviceId
        this.device_name = dto.device_name
        this.ip = dto.ip
        this.exp = dto.exp
        this.iat = dto.iat
    }
}