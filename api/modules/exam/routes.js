const { router } = require("../../utils");
const examFunctions = require("./functions");


// TODO: Implement these

router.post("/exam", examFunctions.create);
router.put("/exam/:examId", examFunctions.update);
router.delete("/exam/:examId", examFunctions.delete);
router.get("/exam/:examId", examFunctions.retrieve);
router.get("/exams", examFunctions.retrieveAll);
