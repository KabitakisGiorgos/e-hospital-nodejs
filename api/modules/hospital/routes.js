const { router } = require("../../utils");
const hospitalFunctions = require("./functions");

// TODO: Implement these

router.post("/hospital", hospitalFunctions.create);
router.put("/hospital/:hospitalId", hospitalFunctions.update);
router.delete("/hospital/:hospitalId", hospitalFunctions.delete);
router.get("/hospital/:hospitalId", hospitalFunctions.retrieve);
router.get("/hospitals", hospitalFunctions.retrieveAll);

// Clinic specific functions
// router.post("/hospital/:hospitalId/clinic/:clinicId", hospitalFunctions.addClinic);
// router.get("/hospital/:hospitalId/clinics", hospitalFunctions.getAllClinics);
// router.delete("/hospital/:hospitalId/clinic/:clinicId", hospitalFunctions.removeClinic);
