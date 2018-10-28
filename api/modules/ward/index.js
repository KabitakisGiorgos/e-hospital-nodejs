const { mapper } = require("../../middleware");

mapper.registerModuleConfig("ward", {
  id: "_id",
  name: "name",
  hospitalId: "hospitalId",
  doctors: "doctors",
  patients: "patients",
  created: "created",
  meta: "meta"
});
