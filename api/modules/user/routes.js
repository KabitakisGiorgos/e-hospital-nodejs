const ensureLogin = require("connect-ensure-login");

const { router } = require("../../utils");
const userFunctions = require("./functions");


const getAccount = [
  ensureLogin.ensureLoggedIn(),
  userFunctions.getAccount
];

router.post("/login", userFunctions.login); //ok
router.get("/logout", userFunctions.logout); //ok
router.get("/account", getAccount); //ok

router.get("/api/userinfo", userFunctions.getUserInfo);

router.post("/user", userFunctions.createUser);

// TODO: Implement these

// router.put("/user/:userId", updateUser);
// router.delete("/user/:userId", deleteUser);
// router.get("/user", getUser);
// router.get("/users", getAllUsers);
