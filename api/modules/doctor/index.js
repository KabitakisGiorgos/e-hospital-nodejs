const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'doctor', {
    id: '_id',
    specialty: 'specialty',
    userId: 'userId',
    departments: 'departments',
    diplomas: 'diplomas',
    created: 'created',
    meta: 'meta'
  });