import { resendClient, sender } from "../lib/resend.js"

export const sendEmail =  async (email,name) => {

    const {data,error} = await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to:email,
        subject:'Hmari App par register honay ka shukria',
        html:`<h1> Welcome ${name} sb </h1>`
    });

    if(error) {
        console.error('Error in sending email: ',error);
        throw new Error('Failed to send email');
    }

    console.log('Email send successfully ',data);
};