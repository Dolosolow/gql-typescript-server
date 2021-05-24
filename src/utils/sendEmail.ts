import sgMail from "@sendgrid/mail";

import { messages } from "../lang";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendConfirmationEmail = async (recipient: string, url: string) => {
  const msg = {
    to: recipient,
    from: "jose.munoz07c@gmail.com",
    subject: messages.email.confirmEmailSubject,
    html: `
    <strong>
      <a href="${url}">${messages.email.confirmBtn}</a>
    </strong>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
};

export const sendForgotPwdEmail = async (recipient: string, url: string) => {
  const msg = {
    to: recipient,
    from: "jose.munoz07c@gmail.com",
    subject: messages.email.resetPasswordSubject,
    html: `
    <strong>
      <a href="${url}">${messages.email.resetPassword}</a>
    </strong>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
};
