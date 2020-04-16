import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBdb,
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