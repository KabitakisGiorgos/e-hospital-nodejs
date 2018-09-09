const router = require("../../middleware/router");
let middleware = require("../../middleware");

router.get("/dialog/authorize", middleware.oauth2.authorize); //ok
router.post("/dialog/authorize/decision", middleware.oauth2.decision); //ok

router.post("/oauth/token", middleware.oauth2.token); //ok working
