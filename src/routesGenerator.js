
const propertiesPlaces = ['name','coordenadas','stars','comments','image'];


const generateRoute = (title,author,topic,location,places,imageQr,imagesPlaces) => ({
    title,
    author,
    topic,
    location,
    places : parsePlaces(places),
    imageQr,
    imagesPlaces,
});


/* Ejemplo de place String

    {
        names: ['1','2','3','4','5'],
        coordenadas : [{x,y},{x,y},{x,y},{x,y},{x,y}],
        starts: [1,2,3,4,4,5,5],
        comments: ['asdasd','asddfgsdfgv asdfc sdfas','asdasd234df234fw','asdasdfsdf','asdfsdrftgwesrgasds asdfa sd','ASDFSADASDASDFSadasfdfsDFADFFF','asdasdgfsddf'],
        imagesKeys: [sha256,sha256,sha256,sha256,sha256,sha256,sha256]
    }


*/

const parsePlaces = placesString => {
    let jPlaces = JSON.parse(placesString);

    let places = [];

    let [names,coordenadas,stars,comments,images_keys] = {jPlaces};
    let size = names.length;
    for(let i = 0; i < size; i++){
        places.push(parsePlace(names[i],coordenadas[i],stars[i],comments[i],images_keys[i]))
    }
    
    return places;


}

const parsePlace = (name,coordenada, stars,comment,image_key) => ({
    name,
    coordenada,
    stars,
    comment,
    image_key
}) 

export default generateRoute;