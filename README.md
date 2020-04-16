# Explorer API

## Introduction



## Endpoints Map

|  **PATH** |  **METHOD**   | **DESCRIPTION**   |
| :------------: | :------------: | :------------: |
|  /  | GET  | 1  |
|  /routes/ | POST  |  2 |
|  /routes/:location | GET  |  3 |
|  /routes/:filterType/:filterValue | GET  | 4|
| /images/qr/:key  | GET  | 5  |
| /images/places/:key  | GET  | 6  |

> This paths are use magic params from Express framework. These are representate with colon ( : )  and name of variable.

## Descriptions
1.  The API give you a simple web page with her documentation
2.  The API get a qr image with this modeling and  images of places that were link whit this route.Only one Route per call.
3.  The API give you a qr key with location parameter (Example: New York,Hyrule,Mordor ... )like this "60d5b1106b708cc134c521aae4e503bb1d2ec3c9bf8ad978f2c659820505d492". **Example of URL: /routes/Hyrule/**
4.  It's like previous one but this can be use with these filters
     -  Title : Route Name. **Example: /routes/title/The fat man's route**
	 -  Author: **Example: /routes/author/Adam Richman**
	 -  Topic: the topic of route **Example: /routes/topic/food**
	 - Location: it's for send two calls on the same time with location.
		- Example point 3: **/routes/Mordor** 
		- Example this point: **/routes/location/Mordor-West**
5.  This endpoint give a qr image with a qr-key
6.  This endpoint give a compress images in .zip with a "places-key" . The key is obtained in the places-key attribute when decoding the QR.



## Packages
### Base
#### To create Web Server
#### _**[Node.js](https://nodejs.org/es/ "Node.js")**_  v12.16.1 
#### _**[express](https://www.npmjs.com/package/express "express")**_ v4.17.1

------------

#### Utilities

> to write :)



