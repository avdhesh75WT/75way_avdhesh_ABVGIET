import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "avdhesh.75way@gmail.com",
    pass: "lsnx meka pcyk qjyn",
  },
});

export default async function sendMail(to: string, title: string) {
  const info = await transporter.sendMail({
    from: "avdhesh.75way@gmail.com",
    to,
    subject: "Task Ran Successfully!!",
    text: `${title} ran successfully?`,
    html: `<h1>${title} ran successfully?</h1>`,
  });
  console.log("Message sent: %s", info.messageId);
}
