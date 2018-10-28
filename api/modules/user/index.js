const { mapper } = require("../../middleware");

mapper.registerModuleConfig("user", {
  id: "_id",
  username: "username",
  email: "email",
  created: "created",
  meta: "meta"
});
