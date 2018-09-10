const { router } = require("../../utils");
const userFunctions = require("./functions");

router.post("/user", userFunctions.createUser);
router.put("/user/:userId", userFunctions.updateUser);
router.delete("/user/:userId", userFunctions.deleteUser);
router.get("/user/:userId", userFunctions.getUser);
router.get("/users", userFunctions.getAllUsers);
