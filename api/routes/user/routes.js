const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const router = require("../../middleware/router");

const login = passport.authenticate("local", {
  successReturnToOrRedirect: "/account",
  failureRedirect: "/"
});

const logout = [
  (request, response) => {
    request.logout();
    response.redirect("/");
  }
];

const getAccount = [
  ensureLogin.ensureLoggedIn(),
  (request, response) => response.render("account", { user: request.user })
];

const getUserInfo = [
  (request, response) => {
    // request.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`. It is typically used to indicate scope of the token,
    // and used in access control checks. For illustrative purposes, this
    // example simply returns the scope in the response.
    response.json({ user_id: request.user.id, name: request.user.name });
  }
];

const createUser = [
  (request, response) => {
    // request.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`. It is typically used to indicate scope of the token,
    // and used in access control checks. For illustrative purposes, this
    // example simply returns the scope in the response.
    response.json({ user_id: request.user.id, name: request.user.name });
  }
];

router.post("/login", login); //ok
router.get("/logout", logout); //ok
router.get("/account", getAccount); //ok

router.get("/api/userinfo", getUserInfo);

router.post("/newuser", createUser);
