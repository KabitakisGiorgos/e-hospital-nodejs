const { mapper } = require("../../middleware");

mapper.registerModuleConfig("hospital", {
  id: "_id",
  name: "name",
  type: "type",
  address: "address",
  wards: "wards",
  clinics: "clinics",
  created: "created",
  meta: "meta"
});
