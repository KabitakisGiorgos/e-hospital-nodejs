const { mapper } = require("../../middleware");

mapper.registerModuleConfig("doctor", {
  id: "_id",
  firstName: "firstName",
  lastName: "lastName",
  age: "age",
  specialty: "specialty",
  userId: "userId",
  clinicId: "clinicId",
  wardId: "wardId",
  diplomas: "diplomas",
  created: "created",
  meta: "meta"
});
