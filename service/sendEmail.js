import nodeoutlook from "nodejs-nodemailer-outlook";

import dotenv from 'dotenv';

export function sendEmail(dest, message) {
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.sender_email,
            pass: process.env.sender_password
        },
        from: process.env.sender_email,
        to: dest,
        subject: 'Hey you, awesome!',
        html: message,



        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    }


    );
}