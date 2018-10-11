const { router } = require("../../utils");
const notificationfunctions = require("./functions");

router.post("/notifications/email", notificationfunctions.sendEmailnotification);
router.post("/notifications/push", notificationfunctions.sendPushnotification);
