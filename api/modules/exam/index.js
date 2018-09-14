const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig(
  'exam', {
    id: '_id',
    state: 'state',
    type: 'type',
    patientId: 'patientId',
    departmentId: 'departmentId',
    doctorId: 'doctorId',
    created: 'created',
    description: 'description',
    meta: 'meta'
  });