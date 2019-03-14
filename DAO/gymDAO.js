const randomstring = require('randomstring');
/* 
photos :[
    {
        photo : FILE,
        gym_data : 'gymId_gymName'
    }, 
    {...}, ...
]
 */
async function savePhotos(photos, connection) {

    try {

        console.log('Dodaj zdjęcia do siłowni ...');

        // Get gym data
        const gym_id = photos[0].gym_data.split('_')[0];
        const gym_Name = photos[0].gym_data.split('_')[1];    
        
        
        

        for (let index = 0; index < photos.length; index++) {
            const el = photos[index];

            // Create unique photo name
            const photo_name = `${gym_Name}_${randomstring.generate(10)}`

            // Prepare query
            let query = `INSERT INTO kuba.gym_photos(
                gym_id, url)
                VALUES ($1,$2);`
            
            let values = [gym_id,photo_name];

            // Execute query
            let res = await connection.query(query,values);           

            await el.photo.mv(`./public/images/${photo_name}.jpg`,
            (err) => {
                if (err) {
                    throw err;
                }
            });


        }

        return{
            response : 'success'
        }

    } catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }

    }

}

module.exports = {
    savePhotos : savePhotos
}