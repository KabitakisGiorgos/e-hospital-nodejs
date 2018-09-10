const { router } = require("../../utils");
let { oauth2 } = require("../../middleware");

/** Possible structure for hooks implementation
  * before/after are arrays in a `api/hooks/oauth.js` file that you can populate.

  const authorize = [
    hooks.oauth.before,
    middleware.oauth2.authorize,
    hooks.oauth.after,
  ];

 */
router.get("/dialog/authorize", oauth2.authorize); //ok
router.post("/dialog/authorize/decision", oauth2.decision); //ok

router.post("/oauth/token", oauth2.token); //ok working
