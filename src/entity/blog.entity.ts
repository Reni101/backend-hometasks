export class Blog {

    createdAt: Date
    isMembership: boolean

    constructor(public name: string,
                public description: string,
                public websiteUrl: string,) {
        this.createdAt = new Date()
        this.isMembership = false
    }

}