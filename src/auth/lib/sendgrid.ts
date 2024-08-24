import sgMail from '@sendgrid/mail';

export const sendEmail = async (to: string, subject: string, text: string) => {
  const apiKey = process.env.SENDGRID_API_TOKEN;
  if (!apiKey) throw new Error('Sendgrid API token is not defined');

  sgMail.setApiKey(apiKey);

  const msg = {
    to,
    from: 'omteam@outreachmagic.io', // ! TO BE REPLACED
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
