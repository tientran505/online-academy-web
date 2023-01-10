import nodemailer from 'nodemailer';
import otpEmailsModel from '../utils/models/otp-emails.model.js';

export default {
  sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'thien.tien1551@gmail.com',
        pass: 'csurydevhtuyoirt',
      },
    });

    let mailOptions = {
        from: 'Web Online Academy <thien.tien1551@gmail.com>',
        to: email,
        subject: 'OTP for verifying your account',
        text: `${otp} is your verify code`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  generateOTP(id) {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
  }
}