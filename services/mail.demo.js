import nodemailer from 'nodemailer';

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

var mailOptions = {
  from: 'Web Online Academy <thien.tien1551@gmail.com>',
  to: 'thien.tien1551@gmail.com',
  subject: 'OTP for verifying your account',
  text: '300960 is your verify code',
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
