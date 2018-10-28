const { router } = require("../../utils");
const hospitalFunctions = require("./functions");

// TODO: Implement these

router.post("/hospital", hospitalFunctions.create);
router.put("/hospital/:hospitalId", hospitalFunctions.update);
router.delete("/hospital/:hospitalId", hospitalFunctions.delete);
router.get("/hospital/:hospitalId", hospitalFunctions.retrieve);
router.get("/hospitals", hospitalFunctions.retrieveAll);

// Ward specific functions
// router.post("/hospital/:hospitalId/ward/:wardId", hospitalFunctions.addWardToHospital);
// router.get("/hospital/:hospitalId/wards", hospitalFunctions.getAllWardsOfHospital);
// router.delete("/hospital/:hospitalId/ward/:wardId", hospitalFunctions.removeWardFromHospital);
