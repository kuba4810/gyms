var nodemailer = require('nodemailer');

// Funkcja otrzymuje dane nowo utworzonego użytkownika
// Id, Kod weryfikacyjny, adres E-mail oraz login
// Generuje wiadomość oraz wysyła na podany adres
module.exports = sendEmail =(user_id,verification_code,email,login) =>{
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'silownie.info@gmail.com',
          pass: 'Irondroplet'
        }
      });
      
      var mailOptions = {
        from: 'SILOWNIE-INFO',
        to: email,
        subject: 'Potwierdzenie rejestracji',
        html: `<div style="background-color:darkgray; padding:32px; height:100%;">
                   <div style="background-color:cornsilk; width:90%; margin-left:auto; margin-right:auto; text-align:center;">
                        <div style="padding:16px 8px; text-align:center; background-color:rgb(255,51,51); color:white;">
                            <h1>Witaj ${login}</h1>
                        </div>
                       <div style="padding:16px 8px; background-color:white; text-align:center;">
                             <h3> Potwierdź swój E-mail klikając na poniższy link </h3>
                            <a href="http://localhost:3000/verify-email/${user_id}/${verification_code}" target="blank" style="text-decoration:none;"> Link aktywacyjny </a> <br>
                               <h3>Lub skopiuj poniższy kod aktywacyjny<h3> 
                               <h5> ${verification_code}<h5> 
                       
                      
                       <br><br>
                       <hr>
                       Copyright  2018 Kozioł & Koczaski
                       </div>
                  </div> 
               </div>
              `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
          return 'Failed'
        } else {
          return 'Success'
        }
      });
    }