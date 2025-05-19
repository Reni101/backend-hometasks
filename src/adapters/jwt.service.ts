import jwt, {JwtPayload} from "jsonwebtoken";
import {SETTINGS} from "../settings";
import type {StringValue} from "ms";


export type tokenType = JwtPayload & { userId: string, deviceId: string  } | null

export const jwtService = {
    async createToken(dto: { userId: string, deviceId?: string, expiresIn?: StringValue | number }): Promise<string> {
        return jwt.sign({userId: dto.userId, deviceId: dto.deviceId}, SETTINGS.SECRET_KEY, {
            expiresIn: dto.expiresIn,
        });
    },
    async decodeToken(token: string): Promise<tokenType> {
        try {
            return jwt.decode(token) as tokenType;
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY) as { userId: string,deviceId:string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
};