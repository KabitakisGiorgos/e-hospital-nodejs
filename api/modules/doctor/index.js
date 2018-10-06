const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'doctor', {
    id: '_id',
    specialty: 'specialty',
    userId: 'userId',
    wardId: 'wardId',
    diplomas: 'diplomas',
    created: 'created',
    meta: 'meta'
  });