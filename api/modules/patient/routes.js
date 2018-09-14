const { router } = require("../../utils");
const patientFunctions = require("./functions");


// TODO: Implement these

router.post("/patient", patientFunctions.create);
router.put("/patient/:patientId", patientFunctions.update);
router.delete("/patient/:patientId", patientFunctions.delete);
router.get("/patient/:patientId", patientFunctions.retrieve);
router.get("/patients", patientFunctions.retrieveAll);

router.post("/patient/exam/:examId",patientFunctions.addExam);
router.delete("/patient/exam/:examId",patientFunctions.removeExam);