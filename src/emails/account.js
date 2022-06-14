const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = process.env.APIKEY;
sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'niroj.magar@ebpearls.com',
        subject:'Thanks for joining with us ',
        text:`Welcome ${name} to messaging API. this api is made by Nikesh Dahal`
    })
}
const sendFairwellMail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'niroj.magar@ebpearls.com',
        subject:'Saying goodbye is never easy.',
        text:` Farewell Dear customer ${name} . Thank you for staying with us on our journey up to today.`
    })
}
module.exports = {
    sendWelcomeMail,
    sendFairwellMail
}
