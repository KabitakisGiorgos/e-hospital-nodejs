const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'ward', {
    id: '_id',
    AMKA: 'AMKA',
    userId: 'userId',
    type: 'type',
    exams: 'exams',
    created: 'created',
    meta: 'meta'
  });