const { router } = require("../utils");
const { userController } = require("../controllers");

router.post("/login", userController.login); //ok
router.get("/logout", userController.logout); //ok
router.get("/account", userController.getAccount); //ok

router.get("/api/userinfo", userController.getUserInfo);

router.post("/user", userController.createUser);

// TODO: Implement these

router.put("/user/:userId", userController.updateUser);
router.delete("/user/:userId", userController.deleteUser);
router.get("/user/:userId", userController.getUser);
router.get("/users", userController.getAllUsers);
