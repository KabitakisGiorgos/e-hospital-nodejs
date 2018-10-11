const { router } = require("../../utils");
const clinicFunctions = require("./functions");

// TODO: Implement these

router.post("/clinic", clinicFunctions.create);
router.put("/clinic/:cId", clinicFunctions.update);
router.delete("/clinic/:cId", clinicFunctions.delete);
router.get("/clinic/:cId", clinicFunctions.retrieve);
router.get("/clinic", clinicFunctions.retrieveAll);
