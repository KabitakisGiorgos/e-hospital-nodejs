const mapObj = require('map-obj');

const mapper = (object, config) => {
  if( Array.isArray(object)) {
    let array=[];
    for (let i = 0; i < object.length; i++) {
      array.push(mapObj(config, (key, value) => [key, object[i][value]]))
    }
    return array;
  } else {
    var newObject = mapObj(config, (key, value) => [key, object[value]]);
    return newObject;
  }
}

module.exports = mapper;