const { router } = require("../../utils");
const wardFunctions = require("./functions");


// TODO: Implement these

router.post("/ward", wardFunctions.create);
router.put("/ward/:wardId", wardFunctions.update);
router.delete("/ward/:wardId", wardFunctions.delete);
router.get("/ward/:wardId", wardFunctions.retrieve);
router.get("/wards", wardFunctions.retrieveAll);


router.put("/ward/:wardId/waiting", wardFunctions.addWatitingPatient);
router.get("/ward/:wardId/waiting", wardFunctions.retrieveWaitingPatients);
router.get("/ward/:wardId/waiting/:patientId", wardFunctions.retrieveWaitingPatient);