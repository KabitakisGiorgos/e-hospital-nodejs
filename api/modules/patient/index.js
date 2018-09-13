const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'patient', {
    id: '_id',
    AMKA: 'AMKA',
    userId: 'userId',
    type: 'type',
    exams: 'exams',
    created: 'created',
    meta: 'meta'
  });