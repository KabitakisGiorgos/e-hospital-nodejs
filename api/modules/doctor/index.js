const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'doctor', {
    id: '_id',
    specialty: 'specialty',
    userId: 'userId',
    departmentId: 'departmentId',
    diplomas: 'diplomas',
    created: 'created',
    meta: 'meta'
  });