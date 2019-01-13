
module.exports = (app,client)=>{
 
/* LOG IN */
/* -------------------------------------------------------------------------------------- */

app.post('/logIn',function(request,response){
    console.log('Log in...');
        
    let data = request.body;
    console.log(data);
    
    let values =[data.Login,data.Password]
    let schema = data.type === 'user' ? 'kuba' : 'trainers';
    let user_table = data.type === 'user' ? 'users' : 'trainer';
    let table_name = data.type === 'user' ? 'user_messages' : 'trainer_messages';
    let column_name = data.type === 'user' ? 'user_id' : 'trainer_id';  
    
      
    var responseData = {
        messageCount:0,
        notificationsCount:0,
        userData : {
            user_id:'',
            login:'',
            isEmailConfirmed : ''
        }
    
    }
    
    client.query(`SELECT * FROM ${schema}.${user_table} WHERE login = $1 and passw = $2`,values)
        .then(res=>{
            if(res.rows.length == 0){
                return Promise.reject({
                    type: "loginFailed",
                    message : 'Błędny login lub hasło !'
                })
            }
            else{
                let userData = {
                    user_id: res.rows[0][column_name],
                    login: data.Login,
                    isEmailConfirmed : res.rows[0].is_email_confirmed
               }
               console.log("Dane użytkownika: ",userData);
                // Msg count    
                var query = `SELECT count(*) as "msg_count" 
                FROM ${schema}.${table_name} m_t natural join kuba.messages ms
                WHERE m_t.${column_name} = $1 and ms.is_read = false and m_t.type='receiver'`
    
                console.log('Query: ',query);
                
               
                responseData = Object.assign({},responseData,{userData: userData});
                return client.query(query,[res.rows[0][column_name]])
            }
        }).then(res=>{
            responseData = Object.assign({},responseData,{messageCount: res.rows[0].msg_count})
            // Ntf count
            if(data.type==='user'){
                return client.query(`SELECT count(*) as "ntf_count" 
                FROM kuba.user_notifications natural join kuba.notifications
                WHERE user_id=$1 and is_read = false`,[responseData.userData.user_id])
            }else{
                return client.query(`SELECT count(*) as "ntf_count" 
                FROM trainers.trainer_notifications natural join kuba.notifications
                WHERE trainer_id=$1 and is_read = false`,[responseData.userData.user_id])
            }
          
        }).then((res)=>{
            responseData = Object.assign({},responseData,{notificationsCount: res.rows[0].ntf_count})
            console.log("Dane użytkownika wraz z liczbą wiadomości i powiadomień : ",responseData);
            response.json({
                type : 'success',
                data : responseData
            })
        }).catch(err=>{
            console.log(err);
            if(typeof(err.type)!=='undefined')
            {
                console.log('Wysyłam błąd failed');
                response.json(err)
            }
            else{
                response.json({
                    type: 'serverError',
                    message: 'Wystąpił błąd, spróbuj ponownie później !'
                })
            }
        })
    
    
    });

    
/* USER DATA */
/* ------------------------------ */
app.get('/getUserData/:login',(request,response)=>{
    var login = request.params.login;

    console.log("Parametr: ",login);

    var query = `SELECT users.*,us.*
                 FROM kuba.users natural join kuba.user_statistics us
                 WHERE users.login = $1`;
    var values = [login];

    client.query(query,values)
    .then(res=>{

        if(res.rows.length > 0) {
            response.send({
                response : 'success',
                type: 'user',
                data: res.rows[0]
            })
            return Promise.reject('Done');
        }  
        else{
            return client.query(`SELECT trainer.*
            FROM trainers.trainer
            WHERE login = $1`,[login])
        }
    })
    .then(res=>{
        response.send({
            response : 'success',
            type: 'trainer',
            data: res.rows[0]
        })
    })
    .catch(err=>{
        if(err!=='Done'){
            response.send({
                response: 'failed'
            })
        }
        console.log(err);
        
    })
    


  
});


// Pobiera liczbę nowych wiadomości danego użytkownika
// ------------------------------------------------------------------------------------------------
app.get('/api/user/:user_id/:type/msgCount',(request,response)=>{
    console.log('msgCount...');

    
    // Ustalanie nazw schematów, tabel i kolumn
    let schema = request.params.type === 'user' ? 'kuba' : 'trainers';
    let table_name = request.params.type === 'user' ? 'user_messages' : 'trainer_messages';
    let column_name =request.params.type === 'user' ? 'user_id' : 'trainer_id';

    let query = `SELECT count(*) as "msg_count" 
    FROM ${schema}.${table_name} m_t natural join kuba.messages ms
    WHERE m_t.${column_name} = $1 and ms.is_read = false and m_t.type='receiver'`;
    console.log('Query: ',query)
    console.log(request.params.type,schema,table_name,column_name);
    
            
    client.query(query,[request.params.user_id])
   
    .then( res => {
        if( res.rows.length > 0 ){
            response.json({
                response: 'success',
                data: res.rows[0].msg_count
            })
        }
        else{
            return Promise.reject({
               type: 'failed'
            })
        }
    })
    .catch(err=>{
        console.log(err);
            response.json({
                response: 'failed'
            })
    })

});


// Pobiera liczbę nowych powiadomień danego użytkownika
// ------------------------------------------------------------------------------------------------
app.get('/api/user/:user_id/:type/ntfCount',(request,response)=>{
  

     // Ustalanie nazw schematów, tabel i kolumn
    let query;
    let values = [request.params.user_id];
    if(request.params.type === 'user'){
        query = `SELECT count(*) as "ntf_count" 
                 FROM kuba.user_notifications natural join kuba.notifications
                 WHERE user_id = $1 and is_read = false`
    }else{
        query = `SELECT count(*) as "ntf_count" 
                 FROM trainers.trainer_notifications natural join kuba.notifications
                 WHERE trainer_id = $1 and is_read = false`
    }

    client.query(query,values)
    .then( res => {
        console.log(res.rows);
        
        if( res.rows.length > 0 ){
            response.json({
                response: 'success',
                data: res.rows[0].ntf_count
            })
        }
        else{
            return Promise.reject({
               type: 'failed'
            })
        }
    })
    .catch(err=>{
            response.json({
                response: 'failed'
            })
    })

});

};