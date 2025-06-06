import nodemailer from "nodemailer";
import { UserModel } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { MAIL_PASSWORD, MAIL_USER, mailerHtml, mailerSubject } from "../constants.js";

export const sendEmail = async ({ email, emailType, userId }) => {

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP = await bcryptjs.hash(otp, 10);

        if (emailType === "VERIFY") {
            await UserModel.findByIdAndUpdate(userId, { otp: hashedOTP, otpExpiry: Date.now() + 5*60*1000 });
        } else if (emailType === "FORGOT") {
            await UserModel.findByIdAndUpdate(userId, { otp: hashedOTP, otpExpiry: Date.now() + 5*60*1000 });
        }

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: MAIL_USER,
            to: email,
            subject: mailerSubject(emailType),
            html: mailerHtml(emailType,otp)
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};