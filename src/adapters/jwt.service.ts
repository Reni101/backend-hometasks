import jwt, {JwtPayload} from "jsonwebtoken";
import {SETTINGS} from "../settings";
import type {StringValue} from "ms";


export const jwtService = {
    async createToken(userId: string, expiresIn?: StringValue | number): Promise<string> {
        return jwt.sign({userId}, SETTINGS.SECRET_KEY, {
            expiresIn,
        });
    },
    async decodeToken(token: string): Promise<JwtPayload & { userId: string } | null> {
        try {
            return jwt.decode(token) as JwtPayload as JwtPayload & { userId: string }
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY) as { userId: string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    },
};
