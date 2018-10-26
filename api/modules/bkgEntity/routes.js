const { router } = require("../../utils");
const bkgEntityFunctions = require("./functions");

router.post("/bkgentities", bkgEntityFunctions.create);
router.put("/bkgentities/:bId", bkgEntityFunctions.update);
router.delete("/bkgentities/:bId", bkgEntityFunctions.delete);
router.get("/bkgentities/:bId", bkgEntityFunctions.retrieve);
router.get("/bkgentities", bkgEntityFunctions.retrieveAll);
router.post("/bkgentities/availabilty", bkgEntityFunctions.availability);