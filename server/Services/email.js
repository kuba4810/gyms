var nodemailer = require('nodemailer');
const confirmationTemplate = require('./mailTemplates/confirmationMail');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'silownie.info@gmail.com',
    pass: 'Irondroplet'
  }
});

// Funkcja otrzymuje dane nowo utworzonego użytkownika
// Id, Kod weryfikacyjny, adres E-mail oraz login
// Generuje wiadomość oraz wysyła na podany adres
async function sendEmail(user_id, verification_code, email, login) {

  var mailOptions = {
    from: 'SILOWNIE-INFO',
    to: email,
    subject: 'Potwierdzenie rejestracji',
    html: confirmationTemplate({
      login: login,
      user_id: user_id,
      verificaion_code: verification_code
    })
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return 'Failed'
    } else {
      console.log('Mail sent ...');

      return 'Success'
    }
  });
}

async function trainerWelcomeMail(data){

  var mailOptions = {
    from: 'SILOWNIE-INFO',
    to: data.email,
    subject: 'Potwierdzenie rejestracji',
    html: confirmationTemplate(data)
  };

  try {

    let res = await transporter.sendMail(mailOptions);
    return 'success';
    
  } catch (error) {

    return 'failed';

  }

}

module.exports = {
  trainerWelcomeMail : trainerWelcomeMail
}