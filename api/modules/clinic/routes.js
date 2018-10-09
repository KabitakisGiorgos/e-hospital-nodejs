const { router } = require("../../utils");
const clinicFunctions = require("./functions");


// TODO: Implement these

router.post("/clinic", clinicFunctions.create);
router.put("/clinic/:cid", clinicFunctions.update);
router.delete("/clinic/:cid", clinicFunctions.delete);
router.get("/clinic/:cid", clinicFunctions.retrieve);
router.get("/clinic", clinicFunctions.retrieveAll);
