const { mapper } = require("../../middleware");

mapper.registerModuleConfig("booking", {
  id: "_id",
  bkgEntityId: "bkgEntityId",
  patientId: "patientId",
  timeslot: "timeslot",
  date: "date"
});
