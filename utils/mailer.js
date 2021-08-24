const nodemailer = require('nodemailer');

exports.MAILTYPE = {
    RESETPASS: {
        desc: 'Changing Password', route: 'forgot-pass/'
    },
    VERIFY: {
        desc: 'Verifcation', route: 'verify/'
    }
};

const clientUrl = process.env.CLIENT_URL;

const options = {
    service: 'SendinBlue',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWD
    }
};

exports.sendEmail = function(receiver, type, token) {
    const transporter = nodemailer.createTransport(options);
    const mailData = {
        from: '"noreply@passman"',
        to: receiver,
        subject: type.desc,
        html: `<h1>${type.desc} for Passman</h1>
                <h3>Please click 
                <a href='${clientUrl + type.route + token}'>
                here </a> for ${type.desc.toLowerCase()}</h3>`
    };

    transporter.sendMail(mailData, (err, info) => {
        if (err)
            console.log(err);
        else
            console.log('Email sent : ', info.response);
    })
};
