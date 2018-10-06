const { router } = require("../../utils");
const wardFunctions = require("./functions");


// TODO: Implement these

router.post("/ward", wardFunctions.create);
router.put("/ward/:wardId", wardFunctions.update);
router.delete("/ward/:wardId", wardFunctions.delete);
router.get("/ward/:wardId", wardFunctions.retrieve);
router.get("/wards", wardFunctions.retrieveAll);
