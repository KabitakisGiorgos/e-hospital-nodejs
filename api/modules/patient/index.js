const { mapper } = require("../../middleware");

mapper.registerModuleConfig("patient", {
  id: "_id",
  AMKA: "AMKA",
  firstName: "firstName",
  lastName: "lastName",
  age: "age",
  userId: "userId",
  type: "type",
  exams: "exams",
  created: "created",
  meta: "meta"
});
