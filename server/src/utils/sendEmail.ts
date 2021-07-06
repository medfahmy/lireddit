import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, text: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("testAccount :", testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "pyfspo7vh5purxud@ethereal.email",
      pass: "UAJKSp9MMTPNyB6UJw",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "medfahmy99@gmail.com", // sender address
    to: to, // list of receivers
    subject: "change password", // Subject line
    html: text, // plain text body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}