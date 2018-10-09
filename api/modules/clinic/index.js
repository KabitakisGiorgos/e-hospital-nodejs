const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'clinic', {
    id: '_id',
    name: 'name',
    hospitalId: 'hospitalId',
    wardId: 'wardId',
    created: 'created',
    meta: 'meta'
  });