const { router } = require("../../utils");
const clinicFunctions = require("./functions");

// TODO: Implement these

router.post("/clinic", clinicFunctions.create);
router.put("/clinic/:cId", clinicFunctions.update);
router.delete("/clinic/:cId", clinicFunctions.delete);
router.get("/clinic/:cId", clinicFunctions.retrieve);
router.get("/clinic", clinicFunctions.retrieveAll);

router.put("/clinic/:clinicId/waiting/:patientId", clinicFunctions.addWatitingPatient);
router.get("/clinic/:clinicId/waiting", clinicFunctions.retrieveWaitingPatients);
router.get("/clinic/:clinicId/waiting/:patientId", clinicFunctions.retrieveWaitingPatient);