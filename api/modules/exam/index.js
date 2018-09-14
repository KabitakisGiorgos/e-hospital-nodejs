const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'exam', {
    id: '_id',
    type: 'type',
    patientId: 'patientId',
    doctorId: 'doctorId',
    created: 'created',
    description: 'description',
    meta: 'meta'
  });