const mapObj = require('map-obj');

const mapper=(object, config)=> {
  var newObject = mapObj(config, (key, value) => [key, object[value]]);
  return newObject;
}

module.exports = mapper;