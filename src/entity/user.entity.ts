import {randomUUID} from "crypto";
import {add} from "date-fns";


export class User {
    createdAt: Date;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    }

    recoveryCode: string

    constructor(public login: string,
                public email: string,
                public passwordHash: string,) {
        this.createdAt = new Date()
        this.emailConfirmation = {
            expirationDate: add(new Date(), {
                days: 1
            }),
            confirmationCode: randomUUID(),
            isConfirmed: false
        }
        this.recoveryCode = ''

    }
}
