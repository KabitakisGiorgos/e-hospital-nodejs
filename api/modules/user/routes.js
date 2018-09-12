const { router } = require("../../utils");
const userFunctions = require("./functions");

router.post("/user", userFunctions.create);
router.put("/user/:userId", userFunctions.update);
router.delete("/user/:userId", userFunctions.delete);
router.get("/user/:userId", userFunctions.retrieve);
router.get("/users", userFunctions.retrieveAll);
