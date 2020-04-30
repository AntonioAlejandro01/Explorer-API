# Explorer API

## Introduction
Api to manage routes of places through QR with the location images in zip format.

Runs on [Node.js](https://nodejs.org/es/) v12.16.2 without auth.


## Endpoints Map

|  **PATH** |  **METHOD**   | **DESCRIPTION**   |
| :------------: | :------------: | :------------: |
|  /  | GET  | 1  |
|  /routes/ | POST  |  2 |
|  /routes/:location | GET  |  3 |
|  /routes/:filterType/:filterValue | GET  | 4|
| /images/QR/:key  | GET  | 5  |
| /images/places/:key  | GET  | 6  |
| /data/:qrKey | GET | 7 |

> This paths are use magic params from Express framework. These are representate with colon ( : )  and name of variable.

## Descriptions

1. The API give you a static web page with her documentation.

2. This endpoint receive a JSON like this [example](https://github.com/AntonioAlejandro01/NodeServer/blob/master/exRuta.json) and return message with result and the key that was create.

3. The API give you a _qrKey_ through location parameter (Example: New York,Hyrule,Mordor ... ).The _qrKey_ see like this "60d5b1106b708cc134c521aae4e503bb1d2ec3c9bf8ad978f2c659820505d492". **Example of URL:<ins> /routes/Hyrule/</ins>**

4. It's like previous one but this can be use with these filters.

    - Title : Route Name. **Example:<ins>/routes/title/The%20fat%20man's%20route</ins>**.
    
	- Author: **Example: <ins>/routes/author/Adam Richman</ins>**.

	- Topic: the topic of route **Example: <ins>/routes/topic/food</ins>**.

	- Location: It's for send two parallel calls with different locations.

	    - Example point 3: **<ins>/routes/Mordor</ins>**

	    - Example this point: **<ins>/routes/location/Mordor-West</ins>**

5. This endpoint give a QR image with a _qrkey_.

6. This endpoint gives compress images in _.zip_ with a _placesKey_ . This key is obtained in the endpoint <ins>**7**</ins>.

7. Return a [JSON](https://github.com/AntonioAlejandro01/NodeServer/blob/master/exMetadataRuta.json) that contain stars(downloads that route have it) and _placesKey_ for use in endpoint <ins>**6**</ins>.

## Packages or Dependencies

| **Name** | **Version** | **Description** | **Links** |
| :------: | :---------: | :-------------: | :--------:|
| express |  4.17.1 | Create Web server | [...](https://www.npmjs.com/package/express) |
| express-fileupload |  1.1.6 | Handle files in request | [...](https://www.npmjs.com/package/express-fileupload) |
| morgan |  1.10.0 | Create Logs | [...](https://www.npmjs.com/package/morgan) |
| mysql |  2.18.1 | Connect with database | [...](https://www.npmjs.com/package/mysql) |
| uuid |  7.0.3 | Create unique names from files to save it | [...](https://www.npmjs.com/package/uuid) |
| body-parser |  1.19.0 | Handler easily POST request | [...](https://www.npmjs.com/package/body-parser) |
| cors |  2.8.5 | C.O.R.S. | [...](https://www.npmjs.com/package/cors) |
| dotenv |  8.2.0 | Possibility work with environment variables | [...](https://www.npmjs.com/package/dotenv) |
| adm-zip |  0.4.14 | Analyze .zip to validate structure | [...](https://www.npmjs.com/package/adm-zip) |
| qrcode | 1.4.4 | Create QR from JSON's data received for save it | [...](https://www.npmjs.com/package/qrcode) |
| image-data-uri |  2.0.1 | Convert URI QR data to Nodejs's buffer to write file | [...](https://www.npmjs.com/package/image-data-uri) |

Spain,2020
