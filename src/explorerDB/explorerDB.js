import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'explorer',
    password: 'Explorer2@2@Node',
    database: 'Explorer',
    port: 3306,
});


connection.connect(err => {
    if(err){
        throw err;
    }else{
        console.log('Connection was established');
    }

});



export default connection;