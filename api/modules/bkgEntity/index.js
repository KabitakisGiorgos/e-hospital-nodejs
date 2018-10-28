const {
  mapper
} = require("../../middleware");

mapper.registerModuleConfig("bkgentity", {
  id: "_id",
  clinicId: "clinicId",
  // wardId: "wardId",
  hospitalId: "hospitalId",
  frequency: "frequency",
  availability: "availability",
  opening: "opening",
  closing: "closing",
  days: "days"
});