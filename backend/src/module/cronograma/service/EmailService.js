import nodemailer from 'nodemailer';
import { prisma } from '../../../shared/config/db.js';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export class EmailService {

    async sendMessageVerification(to, userId) {

        //gerar codigo de verificação 6 digitos
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const htmlContent = `
            <html>
                <body>
                    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                        <h2>Codigo de Verificação</h2>
                        <p>Seu codigo de verificação é:</p>
                        <h1 style="color: #4CAF50;">${verificationCode}</h1>
                        <span style="font-size: 12px; color: #888">Este codigo expira em 15 minutos.</span>
                        <p>Por favor, use este codigo para verificar seu email.</p>
                    </div>
                </body>
            </html>
            `;

        transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject:"Email de Verificação - StudyAI",
            html: htmlContent,
        })

        await prisma.verificationToken.create({
            data: {
                codigo: verificationCode.toString(),
                userId: userId,
                email: to,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // Expira em 15 minutos
            }
        })

    }

}