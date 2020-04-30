# Explorer API

## Introduction



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

1. The API give you a simple web page with her documentation

2. This endpoint recive a json like a [example](https://github.com/AntonioAlejandro01/NodeServer/blob/master/exRuta.json) and return message with result and the key that was create.

3. The API give you a qr key with location parameter (Example: New York,Hyrule,Mordor ... )like this "60d5b1106b708cc134c521aae4e503bb1d2ec3c9bf8ad978f2c659820505d492". **Example of URL:<u> /routes/Hyrule/</u>**

4. It's like previous one but this can be use with these filters
    - Title : Route Name. **Example:<u>/routes/title/The%20fat%20man's%20route</u>**
    
	- Author: **Example: <u>/routes/author/Adam Richman</u>**

	- Topic: the topic of route **Example: <u>/routes/topic/food</u>**

	- Location: it's for send two calls on the same time with location.

	    - Example point 3: **<u>/routes/Mordor</u>**

	    - Example this point: **<u>/routes/location/Mordor-West</u>**

5. This endpoint give a qr image with a qr-key

6. This endpoint give a compress images in .zip with a "places-key" . The key is obtained in the endpoint <u>**7**</u>.

7. Return a [json](https://github.com/AntonioAlejandro01/NodeServer/blob/master/exMetadataRuta.json) with stars(downloads that route have it) and placesKey for use in endpoint <u>**6**</u>.

## Packages or Dependencies

<table align="center" style="border:3px solid black;border-collapse:true;text-align:center;margin-top:0.5em">
    <thead>
		<tr style="padding-bottom: 1em;font-size:1.3em;">
    		<th style="padding: 1em">Name</th>
    		<th style="padding: 1em">Version</th>
    		<th style="padding: 1em">Propouse</th>
		</tr>
	</thead>
	<thbody>
        <tr>
		    <td>express</td>
		    <td>4.17.1</td>
		    <td>Create Web server</td>
		</tr>
        <tr>
		    <td>express-fileupload</td>
		    <td>1.1.6</td>
		    <td>Handler files in request</td>
		</tr>
        <tr>
		    <td>morgan</td>
		    <td>1.10.0</td>
		    <td>Create Logs</td>
		</tr>
        <tr>
		    <td>mysql</td>
		    <td>2.18.1</td>
		    <td>Connect with database</td>
		</tr>
        <tr>
		    <td>uuid</td>
		    <td>7.0.3</td>
		    <td>Create unique names from files that it will save</td>
		</tr>
        <tr>
		    <td>body-parser</td>
		    <td>1.19.0</td>
		    <td>Handler easily POST request</td>
		</tr>
        <tr>
		    <td>cors</td>
		    <td>2.8.5</td>
		    <td>C.O.R.S.</td>
		</tr>
        <tr>
		    <td>dotenv</td>
		    <td>8.2.0</td>
		    <td>Posibility work with enviroment variables</td>
		</tr>
        <tr>
		    <td>adm-zip</td>
		    <td>0.4.14</td>
		    <td>Analize .zip for validate structure</td>
		</tr>
        <tr>
		    <td>qrcode</td>
		    <td>1.4.4</td>
		    <td>Create QR from json data recivedfor save it</td>
		</tr>
        <tr>
		    <td>image-data-uri</td>
		    <td>2.0.1</td>
		    <td>Convert uri qr data to node buffer for write file</td>
		</tr>
	</thbody>
</table>


> to write :)



