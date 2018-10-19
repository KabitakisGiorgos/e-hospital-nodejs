const { router } = require("../../utils");
const bookingFunctions = require("./functions");

// TODO: Implement these

router.post("/bookings", bookingFunctions.create);
router.put("/bookings/:bId", bookingFunctions.update);
router.delete("/bookings/:bId", bookingFunctions.delete);
router.get("/bookings/:bId", bookingFunctions.retrieve);
router.get("/bookings", bookingFunctions.retrieveAll);
