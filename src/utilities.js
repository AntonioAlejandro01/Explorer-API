import fs from 'fs';
import path from 'path';
import QR from 'qrcode';

const logfile = path.join(__dirname,'../server.log'); 


export function deleteFile(ruta){
    fs.unlink(ruta, () => {
        console.log("\x1b[33m","Fichero borrado","\x1b[0m"); 
    });
}

export default function writeLog(err){
    fs.appendFile(logfile,`${new Date()}---${err}\n`,() => {
        console.log("\x1b[31m","Registrado log","\x1b[0m"); 
    });
}

export function writeQRTermial(data){
    QR.toString(data,data2 => {
        console.log(data2);
    })
}


