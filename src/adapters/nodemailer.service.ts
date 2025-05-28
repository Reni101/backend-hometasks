import nodemailer from 'nodemailer';


export const nodemailerService = {
    async sendEmail(html: string, email: string, subject: string): Promise<boolean> {
        let transporter = nodemailer.createTransport({
            service: 'Mail.ru',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });


        let info = await transporter.sendMail({
            from: `${process.env.EMAIL}`,
            to: email,
            subject,
            html,
        });

        return !!info;
    },
};
