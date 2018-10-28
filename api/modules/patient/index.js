const { mapper } = require("../../middleware");

mapper.registerModuleConfig("patient", {
  id: "_id",
  AMKA: "AMKA",
  userId: "userId",
  firstName: "firstName",
  lastName: "lastName",
  age: "age",
  type: "type",
  exams: "exams",
  created: "created",
  meta: "meta"
});
