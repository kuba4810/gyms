module.exports= (app,client)=>{

// Get all notifications for specified user
app.post('/notifications/', (request,response) => {

    console.log('Notifications... ',request.body);
   
     /* Body
        {
            user_id
            user_type
        }
     */
     let user_id = request.body.user_id;
     let user_type = request.body.user_type;
     let query;
     let values = [user_id];

     if(user_type === 'trainer'){
         query = `SELECT tn.trainer_id, n.* FROM trainers.trainer_notifications tn natural join kuba.notifications n
                  WHERE trainer_id = $1`
     }else{
          query = `SELECT un.user_id, n.* FROM kuba.user_notifications un natural join kuba.notifications n
                   WHERE user_id = $1`
     }

     client.query(query,values)
        .then(res=>res.rows)
        .then(res=>{
            if(res.length === 0){
                response.json({
                    notificationsCount: 0
                })
            }else{
                response.json({
                    notificationsCount : res.length,
                    notifications : res
                   });
            }
        })
        .catch(err=>{
            console.log('Wystąpił błąd, spróbuj ponownie później !',err);
        })
        .finally(()=>{
           
        })
});
};