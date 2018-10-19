const { mapper } = require("../../middleware");

mapper.registerModuleConfig("bkgentity", {
  id: "_id",
  wardId: " wardId",
  hospitalId: "hospitalId",
  frequency: "frequency",
  days:"days"
});
