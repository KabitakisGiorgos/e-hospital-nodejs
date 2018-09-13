const mapObj = require('map-obj');

let modules=[];

const registerModuleConfig=(moduleName,config)=>{
  modules[moduleName]=config;
}

const mapper = (object, moduleName) => {
  var config=modules[moduleName];//if the module is not registered check
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

module.exports = {
  mapper,
  registerModuleConfig
}