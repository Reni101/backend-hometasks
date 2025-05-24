export class RateLimit {
    date: Date

    constructor(public ip: string,
                public url: string) {
        this.date = new Date()
    }
}