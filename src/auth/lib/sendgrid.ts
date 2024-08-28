import sgMail from '@sendgrid/mail';

type EmailData = Omit<sgMail.MailDataRequired, 'from'>;

export const sendEmail = async (data: EmailData, templateId: string) => {
  const apiKey = process.env.SENDGRID_API_TOKEN;
  if (!apiKey) throw new Error('Sendgrid API token is not defined');

  sgMail.setApiKey(apiKey);

  const msg: sgMail.MailDataRequired = {
    from: 'omteam@outreachmagic.io', // ! TO BE REPLACED
    templateId,
    ...data,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${data?.to}`);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
