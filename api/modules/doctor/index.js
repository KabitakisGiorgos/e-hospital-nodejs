const { mapper } = require("../../middleware");

mapper.registerModuleConfig("doctor", {
  id: "_id",
  name: "name",
  age: "age",
  specialty: "specialty",
  userId: "userId",
  wardId: "wardId",
  diplomas: "diplomas",
  created: "created",
  meta: "meta"
});
