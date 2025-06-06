export const CORS_ORIGIN = process.env.CORS_ORIGIN
export const PORT = process.env.PORT
export const DB_NAME = process.env.DB_NAME
export const MONGODB_URI = process.env.MONGODB_URI
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD

export const mailerSubject = (emailType) => {
    if (emailType == "VERIFY") {
        return "Please verify your account to login "
    }
    else if (emailType == "FORGOT") {
        return "Please change your account password here"
    }
}

export const mailerHtml = (emailType, otp) => {
    const baseStyle = `style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f9f9f9;" `;

    const cardStyle = `style="background-color:#fff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);padding:40px;text-align:center;"`;

    const otpStyle = `style="display:inline-block;background-color:#007bff;color:#fff;padding:15px 30px;
      font-size:32px;letter-spacing:5px;border-radius:6px;margin-top:20px;"`;

    let heading = "";
    let message = "";

    if (emailType == "VERIFY") {
        heading = "Verify Your Account";
        message = "Use the code below to verify your email and activate your account.";
    }
    else if (emailType == "FORGOT") {
        heading = "Reset Your Password";
        message = "Use the code below to reset your password.";
    }
    return `
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <title>${heading}</title>
                </head>
                <body ${baseStyle}>
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table width="600" cellpadding="0" cellspacing="0" ${cardStyle}>
                                    <tr>
                                        <td style="font-size: 24px; font-weight: bold; color: #333;">
                                            ${heading}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 15px; font-size: 16px; color: #555;">
                                            ${message}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div ${otpStyle}>${otp}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 14px; color: #999; padding-top: 20px;">
                                            This code will expire in 5 minutes. Do not share it with anyone.
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
    `;

}