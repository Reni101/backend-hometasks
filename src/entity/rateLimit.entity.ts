export class RateLimit {
    ip: string
    URL: string
    date: Date

    constructor(dto: { URL: string, ip: string }) {
        this.ip = dto.ip
        this.URL = dto.URL
        this.date = new Date()
    }
}