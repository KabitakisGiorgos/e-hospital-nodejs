const { mapper } = require("../../middleware");

mapper.registerModuleConfig("ward", {
  id: "_id",
  name: "name",
  hospitalId: "hospitalId",
  doctors: "doctors",
  patients: "patients",
  waitingList: "waitingList",
  created: "created",
  meta: "meta"
});
