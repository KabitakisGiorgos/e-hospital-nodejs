const { mapper } = require("../../middleware");

mapper.registerModuleConfig(
  'exam', {
    id: '_id',
    state: 'state',
    type: 'type',
    patientId: 'patientId',
    clinicId: 'clinicId',
    doctorId: 'doctorId',
    created: 'created',
    description: 'description',
    meta: 'meta'
  });
