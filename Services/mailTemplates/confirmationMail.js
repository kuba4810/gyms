module.exports = data =>{
    return `<div style="background-color:darkgray; padding:32px; height:100%;">
    <div style="background-color:cornsilk; width:90%; margin-left:auto; margin-right:auto; text-align:center;">
         <div style="padding:16px 8px; text-align:center; background-color:rgb(255,51,51); color:white;">
             <h1>Witaj ${data.login}</h1>
         </div>
        <div style="padding:16px 8px; background-color:white; text-align:center;">
              <h3> Potwierdź swój E-mail klikając na poniższy link </h3>
             <a href="http://localhost:8080/verify-email/${data.verification_code}" target="blank" style="text-decoration:none;"> Link aktywacyjny </a> <br>
                <h3>Lub skopiuj poniższy kod aktywacyjny<h3> 
                <h5> ${data.verification_code}<h5> 
        
       
        <br><br>
        <hr>
        Copyright  2018 Kozioł & Koczaski
        </div>
   </div> 
</div>
`
}