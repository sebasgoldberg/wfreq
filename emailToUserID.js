const csv=require('csvtojson');

let params = process.argv.slice(2);
var csvFile = params[0];


csv({delimiter: 'auto'})
.fromFile(csvFile)
.then(async (users) =>{

    emailToUserID = {};

    for (let user of users){

        let email = user['E-Mail'];
        let userID = user['User ID'];
        emailToUserID[email] = userID;

    }

    console.log(JSON.stringify(emailToUserID));

});
