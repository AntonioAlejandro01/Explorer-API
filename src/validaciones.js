import AdmZip from 'adm-zip';

const OBJECT_KEYS_JSON = [
  'title',
  'author',
  'location',
  'topic',
  'places',
  'nombres',
  'latitudes',
  'longitudes',
  'comments',
];
const FILE_EXTENSIONS = ['png', 'jpg', 'jpeg'];

export default function validateFormatRoute(route) {
  let jRoute = route;

  let first = Object.keys(jRoute)
    .map((item) => {
      OBJECT_KEYS_JSON.includes(item);
    })
    .includes(false);
  if (first) {
    //global format is not valid
    return false;
  }
  let places = jRoute.places;
  let second = Object.keys(places)
    .map((item) => OBJECT_KEYS_JSON.includes(item))
    .includes(false);
  if (second) {
    // attribute place format is not valid
    return false;
  }
  if (
    Object.keys(jRoute)
      .map((key) => jRoute[key])
      .includes(false) ||
    Object.keys(places)
      .map((key) => places[key])
      .includes(false)
  ) {
    return false;
  }

  return true;
}

export function validateZip(source) {
  let zip = new AdmZip(source);

  let zipEntries = zip.getEntries();
  //check if zip have folder
  if (zipEntries.map((item) => item.isDirectory).includes(true)) {
    return undefined;
  }
  // check if files have correct extension
  if (
    zipEntries
      .map((item) => FILE_EXTENSIONS.includes(item.name.split('.')[1]))
      .includes(false)
  ) {
    return undefined;
  }

  return true;
}
