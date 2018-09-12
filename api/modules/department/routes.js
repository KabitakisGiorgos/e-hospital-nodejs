const { router } = require("../../utils");
const departmentFunctions = require("./functions");


// TODO: Implement these

router.post("/department", departmentFunctions.create);
router.put("/department/:departmentId", departmentFunctions.update);
router.delete("/department/:departmentId", departmentFunctions.delete);
router.get("/department/:departmentId", departmentFunctions.retrieve);
router.get("/departments", departmentFunctions.retrieveAll);
