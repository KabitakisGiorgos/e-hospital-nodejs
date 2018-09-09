const { router } = require("../utils");
const { userController } = require("../controllers");

router.post("/login", userController.login); //ok
router.get("/logout", userController.logout); //ok
router.get("/account", userController.getAccount); //ok

router.get("/api/userinfo", userController.getUserInfo);

router.post("/user", userController.createUser);

// TODO: Implement these

// router.put("/user/:userId", updateUser);
// router.delete("/user/:userId", deleteUser);
// router.get("/user", getUser);
// router.get("/users", getAllUsers);
