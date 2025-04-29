import nodemailer from 'nodemailer';


export const nodemailerService = {
    async sendEmail(
        email: string,
        code: string,
    ): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });


        const html = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
        </p>`

        let info = await transporter.sendMail({
            from: 'Backend',
            to: email,
            subject: 'Your code is here',
            html,
        });

        return !!info;
    },
};
